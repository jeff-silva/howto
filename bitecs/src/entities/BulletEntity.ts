import * as THREE from "three";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { BulletComponent } from "../components/BulletComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";

import { ColorComponent } from "../components/ColorComponent";

// Faixa comprida para o tiro (em vez de um cilindro)
// Aumentamos o comprimento de 4 para 15 para parecer um "tracer" de metralhadora
const bulletGeometry = new THREE.PlaneGeometry(0.5, 15); 
bulletGeometry.rotateX(Math.PI / 2); // Alinha com o eixo Z (aponta pra frente)

const bulletMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xffffff,
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide // Para ser visível de qualquer ângulo após o giro
});

export function createBulletEntity(world: IWorld, position: THREE.Vector3, quaternion: THREE.Quaternion, isEnemy: boolean = false) {
  const entity = addEntity(world);

  addComponent(world, PositionComponent, entity);
  addComponent(world, RotationComponent, entity);
  addComponent(world, BulletComponent, entity);
  addComponent(world, ColorComponent, entity); // Adiciona cor para podermos piscar

  PositionComponent.x[entity] = position.x;
  PositionComponent.y[entity] = position.y;
  PositionComponent.z[entity] = position.z;

  // Adiciona uma rotação aleatória no eixo Z (roll) para dar o visual caótico do tiro
  const randomRoll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, -1), Math.random() * Math.PI * 2);
  const finalQuat = quaternion.clone().multiply(randomRoll);

  RotationComponent.x[entity] = finalQuat.x;
  RotationComponent.y[entity] = finalQuat.y;
  RotationComponent.z[entity] = finalQuat.z;
  RotationComponent.w[entity] = finalQuat.w;

  BulletComponent.distanceTraveled[entity] = 0;
  BulletComponent.speed[entity] = 15.0; // Velocidade aumentada para compensar aviões mais rápidos
  BulletComponent.isEnemy[entity] = isEnemy ? 1 : 0;

  // Cor base
  if (isEnemy) {
    ColorComponent.r[entity] = 1.0;
    ColorComponent.g[entity] = 0.0;
    ColorComponent.b[entity] = 0.0;
  } else {
    ColorComponent.r[entity] = 1.0;
    ColorComponent.g[entity] = 1.0;
    ColorComponent.b[entity] = 1.0;
  }

  // Clona o material para que cada tiro possa piscar de forma independente
  const mesh = new THREE.Mesh(bulletGeometry, bulletMaterial.clone());
  
  scene.add(mesh);
  meshMap.set(entity, mesh);

  return entity;
}
