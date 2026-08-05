use bevy::prelude::*;

fn main() {
    App::new()
        // DefaultPlugins inclui tudo necessário para janelas, gráficos e inputs
        .add_plugins(DefaultPlugins)
        // Adiciona a função setup para rodar apenas uma vez na inicialização
        .add_systems(Startup, setup)
        // Adiciona a função de rotação para rodar a cada frame
        .add_systems(Update, rotate_cube)
        .run();
}

// Marcador para identificar qual entidade é o cubo que queremos rotacionar
#[derive(Component)]
struct RotatableCube;

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    // 1. Câmera
    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(-2.0, 2.5, 5.0).looking_at(Vec3::ZERO, Vec3::Y),
        ..default()
    });

    // 2. Luz
    commands.spawn(PointLightBundle {
        point_light: PointLight {
            intensity: 1500.0,
            shadows_enabled: true,
            ..default()
        },
        transform: Transform::from_xyz(4.0, 8.0, 4.0),
        ..default()
    });

    // 3. Cubo Vermelho
    commands.spawn((
        PbrBundle {
            // Forma do cubo
            mesh: meshes.add(Cuboid::new(1.0, 1.0, 1.0)),
            // Cor vermelha
            material: materials.add(Color::srgb(1.0, 0.0, 0.0)),
            // Posição inicial no centro
            transform: Transform::from_xyz(0.0, 0.5, 0.0),
            ..default()
        },
        // Adicionando nosso componente para identificá-lo depois
        RotatableCube,
    ));
}

fn rotate_cube(
    keyboard_input: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
    // Pega as entidades (cubos) que possuem o componente RotatableCube
    mut query: Query<&mut Transform, With<RotatableCube>>,
) {
    // Se a barra de espaço estiver pressionada
    if keyboard_input.pressed(KeyCode::Space) {
        // Rotaciona cada cubo encontrado na nossa query
        for mut transform in &mut query {
            // Rotaciona ao longo do eixo Y considerando o tempo entre frames
            transform.rotate_y(time.delta_seconds() * 2.0); 
        }
    }
}
