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

export function createExplosionEntity(world: IWorld, x: number, y: number, z: number, type: "DIRT" | "SPARK" = "DIRT") {
  // Faíscas geram um pouco mais de partículas que a terra
  const numParticles = type === "SPARK" ? 8 + Math.floor(Math.random() * 8) : 5 + Math.floor(Math.random() * 6);

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

      ColorComponent.r[entity] = 0.24; // #3d
      ColorComponent.g[entity] = 0.13; // #23
      ColorComponent.b[entity] = 0.08; // #14
    } else {
      // Velocidade de faísca (espalhamento agressivo e rápido)
      VelocityComponent.x[entity] = (Math.random() - 0.5) * 2.0;
      VelocityComponent.y[entity] = (Math.random() - 0.5) * 2.0; // Voa pra todo lado
      VelocityComponent.z[entity] = (Math.random() - 0.5) * 2.0;

      ColorComponent.r[entity] = 1.0;  // #FF
      ColorComponent.g[entity] = 0.66; // #AA
      ColorComponent.b[entity] = 0.0;  // #00
    }

    OpacityComponent.opacity[entity] = 1.0;

    // Tempo de vida varia ligeiramente pra não sumirem todas juntas
    // Faíscas apagam muito mais rápido que poeira
    const life = type === "SPARK" ? 5.0 + Math.random() * 10.0 : 20.0 + Math.random() * 20.0;
    ExplosionComponent.maxLifetime[entity] = life;
    ExplosionComponent.lifetime[entity] = life;

    // Clona pra piscar ou apagar opacidade de forma independente
    const mesh = new THREE.Mesh(
      type === "SPARK" ? sparkGeometry : dirtGeometry, 
      type === "SPARK" ? sparkMaterial.clone() : dirtMaterial.clone()
    );
    
    // Tamanho um pouco aleatório
    const scale = 0.5 + Math.random() * 1.0;
    mesh.scale.set(scale, scale, scale);

    scene.add(mesh);
    meshMap.set(entity, mesh);
  }

  return -1; // Retorna -1 pois geramos várias entidades
}
