import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";

const loader = new GLTFLoader();

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

  // Aumentamos a velocidade deles (player é 0.5) para eles ultrapassarem bem rápido e não sumirem no horizonte
  EnemyComponent.speed[entity] = 1.2 + Math.random() * 0.3;
  EnemyComponent.state[entity] = 0; // Começa tentando ir para a frente do jogador
  EnemyComponent.targetOffsetX[entity] = Math.random() > 0.5 ? 1 : -1; // Multiplicador de direção (1 = Direita, -1 = Esquerda)

  loader.load("/models/f15.glb", (gltf) => {
    const mesh = gltf.scene.clone(); // Usa clone pra não interferir no avião do player se cache for usado

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
  });

  return entity;
}
