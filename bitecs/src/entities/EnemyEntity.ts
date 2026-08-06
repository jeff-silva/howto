import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";

const loader = new GLTFLoader();

let cachedEnemyModel: THREE.Group | null = null;

export function createEnemyEntity(
  world: IWorld,
  x: number,
  y: number,
  z: number,
) {
  const entity = addEntity(world);

  addComponent(world, PositionComponent, entity);
  addComponent(world, RotationComponent, entity);
  addComponent(world, EnemyComponent, entity);

  // Initial Position
  PositionComponent.x[entity] = x;
  PositionComponent.y[entity] = y;
  PositionComponent.z[entity] = z;

  // Initial Rotation
  RotationComponent.x[entity] = 0;
  RotationComponent.y[entity] = 0;
  RotationComponent.z[entity] = 0;
  RotationComponent.w[entity] = 1;

  // Eles não têm velocidade fixa mais, usam um offset acima da velocidade do player
  EnemyComponent.speed[entity] = 0; // Calculado no AI System
  EnemyComponent.speedOffset[entity] = 0.5 + Math.random() * 0.5; // Entre 0.5 e 1.0 mais rápido que o player
  
  EnemyComponent.state[entity] = 0;
  EnemyComponent.targetOffsetX[entity] = Math.random() > 0.5 ? 1 : -1;
  EnemyComponent.hp[entity] = 100;
  EnemyComponent.timer[entity] = 0;
  EnemyComponent.lastShotTime[entity] = 0;

  const initMesh = (model: THREE.Group) => {
    const mesh = model.clone();

    // Rotacionamos 90 graus para que o bico dele aponte para a frente (-Z)
    mesh.rotation.y = Math.PI / 2;

    // Ativa sombra e pinta de vermelho
    mesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const c = child as THREE.Mesh;
        c.castShadow = true;

        // Clona o material original para não afetar outras entidades e pinta de vermelho
        if (c.material) {
          const mat = (c.material as THREE.Material).clone();
          if ((mat as any).color) {
            (mat as any).color.setHex(0xff3333);
          }
          c.material = mat;
        }
      }
    });

    const group = new THREE.Group();
    group.add(mesh);

    scene.add(group);
    meshMap.set(entity, group);
  };

  if (cachedEnemyModel) {
    initMesh(cachedEnemyModel);
  } else {
    loader.load("/models/f15.glb", (gltf) => {
      cachedEnemyModel = gltf.scene;
      initMesh(cachedEnemyModel);
    });
  }

  return entity;
}
