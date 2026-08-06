import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";

const loader = new GLTFLoader();

export function createF15Entity(world: IWorld) {
  const entity = addEntity(world);

  addComponent(world, PositionComponent, entity);
  addComponent(world, RotationComponent, entity);
  addComponent(world, PlayerComponent, entity);

  // Initial Position
  PositionComponent.x[entity] = 0.0;
  PositionComponent.y[entity] = 5.0;
  PositionComponent.z[entity] = 0.0;

  // Initial Rotation
  RotationComponent.x[entity] = 0;
  RotationComponent.y[entity] = 0;
  RotationComponent.z[entity] = 0;
  RotationComponent.w[entity] = 1;

  PlayerComponent.speed[entity] = 0;

  loader.load('/models/f15.glb', (gltf) => {
    const mesh = gltf.scene;
    
    // O modelo foi exportado virado para o lado (eixo X).
    // Rotacionamos 90 graus para que o bico dele aponte para a frente (-Z)
    mesh.rotation.y = Math.PI / 2; 

    // Colocamos dentro de um grupo. O RenderSystem vai rotacionar o grupo,
    // mantendo a nossa correção local do modelo 3D intacta!
    const group = new THREE.Group();
    group.add(mesh);

    scene.add(group);
    meshMap.set(entity, group);
  });

  return entity;
}
