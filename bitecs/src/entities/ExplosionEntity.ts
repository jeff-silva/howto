import * as THREE from "three";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { OpacityComponent } from "../components/OpacityComponent";
import { ExplosionComponent } from "../components/ExplosionComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";
import { RotationComponent } from "../components/RotationComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { ColorComponent } from "../components/ColorComponent";

// Geometria e Material compartilhados para todas as pedrinhas de terra
const dirtGeometry = new THREE.BoxGeometry(0.04, 0.04, 0.04);
const dirtMaterial = new THREE.MeshBasicMaterial({
  color: 0x3d2314, // Marrom terra bem escuro
  transparent: true
});

// Geometria e Material para as faíscas amarelas
const sparkGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
const sparkMaterial = new THREE.MeshBasicMaterial({
  color: 0xffaa00, // Amarelo alaranjado (faísca de metal)
  transparent: true
});

// Geometria e Material para Fumaça (Smoke)
const smokeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const smokeMaterial = new THREE.MeshBasicMaterial({
  color: 0x222222, // Cinza muito escuro/preto
  transparent: true,
  opacity: 0.8
});

// Geometria e Material para Bola de Fogo (Fireball gigante)
const fireGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const fireMaterial = new THREE.MeshBasicMaterial({
  color: 0xff4400, // Laranja avermelhado intenso
  transparent: true,
  opacity: 1.0
});

export function createExplosionEntity(world: IWorld, x: number, y: number, z: number, type: "DIRT" | "SPARK" | "SMOKE" | "FIREBALL" = "DIRT") {
  // Quantidade de partículas
  let numParticles = 5 + Math.floor(Math.random() * 6);
  if (type === "SPARK") numParticles = 8 + Math.floor(Math.random() * 8);
  if (type === "SMOKE") numParticles = 2 + Math.floor(Math.random() * 2); // Pouca fumaça por tick
  if (type === "FIREBALL") numParticles = 25 + Math.floor(Math.random() * 15); // Explosão gigante

  for (let i = 0; i < numParticles; i++) {
    const entity = addEntity(world);

    addComponent(world, PositionComponent, entity);
    addComponent(world, RotationComponent, entity);
    addComponent(world, VelocityComponent, entity);
    addComponent(world, OpacityComponent, entity);
    addComponent(world, ExplosionComponent, entity);
    addComponent(world, ColorComponent, entity); // RenderSystem requer ColorComponent para ler Opacity

    PositionComponent.x[entity] = x + (Math.random() - 0.5);
    PositionComponent.y[entity] = y + Math.random();
    PositionComponent.z[entity] = z + (Math.random() - 0.5);

    RotationComponent.x[entity] = Math.random() * Math.PI;
    RotationComponent.y[entity] = Math.random() * Math.PI;
    RotationComponent.z[entity] = Math.random() * Math.PI;
    RotationComponent.w[entity] = 1;
    
    if (type === "DIRT") {
      // Velocidade de terra (pulinho e espalhamento fraco)
      VelocityComponent.x[entity] = (Math.random() - 0.5) * 0.4;
      VelocityComponent.y[entity] = 0.1 + Math.random() * 0.3;
      VelocityComponent.z[entity] = (Math.random() - 0.5) * 0.4;

      ColorComponent.r[entity] = 0.16; // #2A
      ColorComponent.g[entity] = 0.10; // #1A
      ColorComponent.b[entity] = 0.06; // #0F
    } else if (type === "SPARK") {
      // Velocidade de faísca (espalhamento agressivo e rápido)
      VelocityComponent.x[entity] = (Math.random() - 0.5) * 2.0;
      VelocityComponent.y[entity] = (Math.random() - 0.5) * 2.0; // Voa pra todo lado
      VelocityComponent.z[entity] = (Math.random() - 0.5) * 2.0;

      ColorComponent.r[entity] = 1.0;  // #FF
      ColorComponent.g[entity] = 0.66; // #AA
      ColorComponent.b[entity] = 0.0;  // #00
    } else if (type === "SMOKE") {
      // Fumaça sobe lentamente e dispersa pouco (Pilar de fumaça estrito)
      VelocityComponent.x[entity] = (Math.random() - 0.5) * 0.02;
      VelocityComponent.y[entity] = 0.01 + Math.random() * 0.03; // Somente valores positivos
      VelocityComponent.z[entity] = (Math.random() - 0.5) * 0.02;

      ColorComponent.r[entity] = 0.13; // #22
      ColorComponent.g[entity] = 0.13; // #22
      ColorComponent.b[entity] = 0.13; // #22
    } else if (type === "FIREBALL") {
      // Fogo expansivo muito lento, estritamente subindo (zero chance de descer)
      VelocityComponent.x[entity] = (Math.random() - 0.5) * 0.04;
      VelocityComponent.y[entity] = 0.02 + Math.random() * 0.04; // Estritamente positivo
      VelocityComponent.z[entity] = (Math.random() - 0.5) * 0.04;

      // Cores variam entre amarelo claro até vermelho escuro
      const randColor = Math.random();
      if (randColor > 0.7) {
        ColorComponent.r[entity] = 1.0; ColorComponent.g[entity] = 0.8; ColorComponent.b[entity] = 0.2; // Amarelo
      } else if (randColor > 0.3) {
        ColorComponent.r[entity] = 1.0; ColorComponent.g[entity] = 0.3; ColorComponent.b[entity] = 0.0; // Laranja
      } else {
        ColorComponent.r[entity] = 0.8; ColorComponent.g[entity] = 0.0; ColorComponent.b[entity] = 0.0; // Vermelho
      }
    }

    OpacityComponent.opacity[entity] = type === "SMOKE" ? 0.8 : 1.0;

    // Tempo de vida varia ligeiramente pra não sumirem todas juntas
    // Tempo de vida varia ligeiramente
    let life = 20.0 + Math.random() * 20.0;
    if (type === "SPARK") life = 5.0 + Math.random() * 10.0;
    if (type === "SMOKE") life = 30.0 + Math.random() * 20.0;
    if (type === "FIREBALL") life = 60.0 + Math.random() * 40.0; // Duração beeeem longa
    
    ExplosionComponent.maxLifetime[entity] = life;
    ExplosionComponent.lifetime[entity] = life;
    
    // Configura gravidade: fogo e fumaça sobem (gravidade positiva fraca), terra e faísca caem (gravidade negativa)
    if (type === "SMOKE" || type === "FIREBALL") {
      ExplosionComponent.gravity[entity] = 0.002; // Aceleração suave para cima
    } else {
      ExplosionComponent.gravity[entity] = -0.05; // Cai rápido
    }

    let geometry = dirtGeometry;
    let material = dirtMaterial;
    if (type === "SPARK") { geometry = sparkGeometry; material = sparkMaterial; }
    if (type === "SMOKE") { geometry = smokeGeometry; material = smokeMaterial; }
    if (type === "FIREBALL") { geometry = fireGeometry; material = fireMaterial; }

    const mesh = new THREE.Mesh(geometry, material.clone());
    
    // Tamanho um pouco aleatório
    let scale = 0.5 + Math.random() * 1.5;
    if (type === "FIREBALL") scale = 0.8 + Math.random() * 1.2; // Reduzido para não exagerar
    mesh.scale.set(scale, scale, scale);

    scene.add(mesh);
    meshMap.set(entity, mesh);
  }

  return -1; // Retorna -1 pois geramos várias entidades
}
