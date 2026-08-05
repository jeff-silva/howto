use bevy::{prelude::*, window::{CursorGrabMode, PrimaryWindow}};
use std::time::Duration;
use bevy_third_person_camera::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "Meu Jogo Bevy!".to_string(),
                fit_canvas_to_parent: true,
                ..default()
            }),
            ..default()
        }))
        .add_plugins(ThirdPersonCameraPlugin)
        .add_systems(Startup, setup)
        .add_systems(Update, (
            player_movement,
            setup_scene_once_loaded,
            animate_player,
            lock_cursor,
            fix_materials,
        ))
        .run();
}

#[derive(Component)]
struct Player;

#[derive(Component)]
struct PlayerCamera;

// Estrutura para guardar nosso Grafo de Animações
#[derive(Resource)]
struct PlayerAnimations {
    graph: Handle<AnimationGraph>,
    idle: AnimationNodeIndex,
    run: AnimationNodeIndex,
}

fn setup(
    mut commands: Commands,
    asset_server: Res<AssetServer>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut graphs: ResMut<Assets<AnimationGraph>>,
) {
    let mut graph = AnimationGraph::new();
    // Carrega Idle do próprio modelo e Run do arquivo especificado
    let idle_idx = graph.add_clip(asset_server.load("models/olivia.glb#Animation0"), 1.0, graph.root);
    let run_idx = graph.add_clip(asset_server.load("animations/run.glb#Animation0"), 1.0, graph.root);
    let graph_handle = graphs.add(graph);

    commands.insert_resource(PlayerAnimations {
        graph: graph_handle,
        idle: idle_idx,
        run: run_idx,
    });

    commands.spawn((
        SceneBundle {
            scene: asset_server.load("models/olivia.glb#Scene0"),
            // Voltando para escala 1.0 porque 0.01 claramente deixou o modelo microscópico e invisível
            transform: Transform::from_scale(Vec3::splat(1.0)),
            ..default()
        },
        ThirdPersonCameraTarget,
        Player,
    ));

    // 3. Chão (para termos uma referência visual de que estamos andando)
    commands.spawn(PbrBundle {
        mesh: meshes.add(Plane3d::default().mesh().size(50.0, 50.0)),
        material: materials.add(Color::srgb(0.3, 0.5, 0.3)),
        ..default()
    });

    // 4. Luz (Sol)
    commands.spawn(DirectionalLightBundle {
        directional_light: DirectionalLight {
            shadows_enabled: true,
            illuminance: 10000.0,
            ..default()
        },
        transform: Transform::from_xyz(4.0, 8.0, 4.0).looking_at(Vec3::ZERO, Vec3::Y),
        ..default()
    });

    // 5. Câmera controlada pelo plugin
    commands.spawn((
        Camera3dBundle {
            transform: Transform::from_xyz(0.0, 2.5, 5.0).looking_at(Vec3::Y, Vec3::Y),
            ..default()
        },
        ThirdPersonCamera {
            zoom: Zoom::new(1.5, 5.0),
            sensitivity: Vec2::new(3.0, 3.0),
            offset_enabled: true,
            offset: Offset::new(0.0, 1.0),
            cursor_lock_toggle_enabled: false, 
            cursor_lock_active: false,
            ..default()
        },
        PlayerCamera,
    ));
}

// Sistema que injeta as animações assim que o modelo 3D termina de carregar do disco/rede
fn setup_scene_once_loaded(
    mut commands: Commands,
    animations: Res<PlayerAnimations>,
    mut players: Query<(Entity, &mut AnimationPlayer), Added<AnimationPlayer>>,
) {
    for (entity, mut player) in &mut players {
        let mut transitions = AnimationTransitions::new();
        // Começa imediatamente tocando a animação Idle
        transitions.play(&mut player, animations.idle, Duration::ZERO);
        
        // Injeta o grafo e o controlador de transições no modelo
        commands
            .entity(entity)
            .insert(animations.graph.clone())
            .insert(transitions);
    }
}

// O Player de movimentação WASD Relativo à Câmera
fn player_movement(
    keyboard_input: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
    mut query: Query<&mut Transform, With<Player>>,
    camera_query: Query<&Transform, (With<ThirdPersonCamera>, Without<Player>)>,
) {
    let Ok(mut transform) = query.get_single_mut() else { return; };
    let Ok(camera_transform) = camera_query.get_single() else { return; };
    
    // Calcula os vetores 'frente' e 'direita' da câmera, ignorando o eixo Y (para não voar)
    let mut forward = camera_transform.rotation * Vec3::NEG_Z;
    forward.y = 0.0;
    forward = forward.normalize_or_zero();

    let mut right = camera_transform.rotation * Vec3::X;
    right.y = 0.0;
    right = right.normalize_or_zero();

    let mut direction = Vec3::ZERO;
    
    // W/S Move no eixo da câmera
    if keyboard_input.pressed(KeyCode::KeyW) { direction += forward; }
    if keyboard_input.pressed(KeyCode::KeyS) { direction -= forward; }
    // A/D Move no eixo direito da câmera
    if keyboard_input.pressed(KeyCode::KeyA) { direction -= right; }
    if keyboard_input.pressed(KeyCode::KeyD) { direction += right; }

    if direction != Vec3::ZERO {
        direction = direction.normalize();
        
        let target_rotation = Quat::from_rotation_arc(Vec3::Z, direction);
        transform.rotation = transform.rotation.slerp(target_rotation, time.delta_seconds() * 10.0);
        transform.translation += direction * 4.0 * time.delta_seconds();
    }
}

fn lock_cursor(
    mouse: Res<ButtonInput<MouseButton>>,
    mut windows: Query<&mut Window, With<PrimaryWindow>>,
    mut cam_q: Query<&mut ThirdPersonCamera>,
) {
    if mouse.just_pressed(MouseButton::Left) {
        if let Ok(mut window) = windows.get_single_mut() {
            window.cursor.grab_mode = CursorGrabMode::Locked;
            window.cursor.visible = false;
        }
        if let Ok(mut cam) = cam_q.get_single_mut() {
            cam.cursor_lock_active = true;
        }
    }
    if mouse.just_pressed(MouseButton::Right) {
        if let Ok(mut window) = windows.get_single_mut() {
            window.cursor.grab_mode = CursorGrabMode::None;
            window.cursor.visible = true;
        }
        if let Ok(mut cam) = cam_q.get_single_mut() {
            cam.cursor_lock_active = false;
        }
    }
}

// Corrige o bug clássico de conversores GLTF (Mixamo) que exportam materiais 
// como transparentes por engano, desativando o Depth Buffer e rendendo de dentro pra fora.
fn fix_materials(
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut events: EventReader<AssetEvent<StandardMaterial>>,
) {
    for event in events.read() {
        if let AssetEvent::Added { id } | AssetEvent::Modified { id } = event {
            if let Some(mat) = materials.get_mut(*id) {
                mat.alpha_mode = AlphaMode::Opaque;
            }
        }
    }
}


// Troca as animações com base no movimento (Idle vs Walk/Run)
fn animate_player(
    animations: Res<PlayerAnimations>,
    keyboard_input: Res<ButtonInput<KeyCode>>,
    mut players: Query<(&mut AnimationPlayer, &mut AnimationTransitions)>,
) {
    let is_moving = keyboard_input.pressed(KeyCode::KeyW)
        || keyboard_input.pressed(KeyCode::KeyA)
        || keyboard_input.pressed(KeyCode::KeyS)
        || keyboard_input.pressed(KeyCode::KeyD);

    for (mut player, mut transitions) in &mut players {
        let target_anim = if is_moving { animations.run } else { animations.idle };
        transitions.play(&mut player, target_anim, Duration::from_millis(250));
    }
}

// Faz a câmera perseguir o jogador rigidamente (Terceira Pessoa clássica)
fn camera_follow(
    player_query: Query<&Transform, (With<Player>, Without<PlayerCamera>)>,
    mut camera_query: Query<&mut Transform, With<PlayerCamera>>,
) {
    if let Ok(player_transform) = player_query.get_single() {
        if let Ok(mut camera_transform) = camera_query.get_single_mut() {
            let offset = Vec3::new(0.0, 3.0, 6.0); // 3m acima, 6m atrás
            camera_transform.translation = player_transform.translation + offset;
            camera_transform.look_at(player_transform.translation + Vec3::new(0.0, 1.0, 0.0), Vec3::Y);
        }
    }
}
