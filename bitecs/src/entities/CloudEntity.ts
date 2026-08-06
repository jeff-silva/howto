import * as THREE from "three";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { CloudComponent } from "../components/CloudComponent";
import { ScaleComponent } from "../components/ScaleComponent";
import { ColorComponent } from "../components/ColorComponent";
import { OpacityComponent } from "../components/OpacityComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";
import { CLOUD_MAX_OPACITY } from "../systems/CloudSystem";

// Criação da textura procedimental esfumaçada via Canvas
function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Centro sólido
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)"); // Meio macio
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Borda invisível
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

const cloudTexture = createCloudTexture();
const cloudMaterial = new THREE.SpriteMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.9,
  depthWrite: false, // Impede que uma nuvem recorte a outra
});

export function createCloudEntity(
  world: IWorld,
  initialX: number,
  initialY: number,
  initialZ: number,
) {
  const entity = addEntity(world);

  addComponent(world, PositionComponent, entity);
  addComponent(world, RotationComponent, entity);
  addComponent(world, CloudComponent, entity);
  addComponent(world, ScaleComponent, entity);
  addComponent(world, ColorComponent, entity);
  addComponent(world, OpacityComponent, entity);

  PositionComponent.x[entity] = initialX;
  PositionComponent.y[entity] = initialY;
  PositionComponent.z[entity] = initialZ;

  RotationComponent.x[entity] = 0;
  RotationComponent.y[entity] = 0;
  RotationComponent.z[entity] = 0;
  RotationComponent.w[entity] = 1;

  // Opacidade inicial usando a constante global
  OpacityComponent.opacity[entity] = CLOUD_MAX_OPACITY;

  // Tamanho aleatório global da nuvem
  const randomScale = 0.5 + Math.random() * 2.5;
  ScaleComponent.x[entity] = randomScale;
  ScaleComponent.y[entity] = randomScale;
  ScaleComponent.z[entity] = randomScale;

  // Cor aleatória entre cinza escuro e branco
  const grayValue = 0.2 + Math.random() * 0.8;
  ColorComponent.r[entity] = grayValue;
  ColorComponent.g[entity] = grayValue;
  ColorComponent.b[entity] = grayValue;

  // Clonar o material base para que esta nuvem possa ter uma cor independente
  const entityMaterial = cloudMaterial.clone();

  // Criamos um Grupo que representará a nuvem inteira
  const cloudGroup = new THREE.Group();

  // Criamos de 3 a 6 "pufes" de fumaça para dar um formato irregular à nuvem
  const puffs = 3 + Math.floor(Math.random() * 4);

  for (let i = 0; i < puffs; i++) {
    const sprite = new THREE.Sprite(entityMaterial);

    // Espalha os pufes do centro para os lados (formato achatado típico de nuvem)
    sprite.position.x = (Math.random() - 0.5) * 30;
    sprite.position.y = (Math.random() - 0.5) * 10;
    sprite.position.z = (Math.random() - 0.5) * 30;

    // O tamanho de cada pufe individual
    const size = 20 + Math.random() * 20;
    sprite.scale.set(size, size, 1);

    cloudGroup.add(sprite);
  }

  scene.add(cloudGroup);
  meshMap.set(entity, cloudGroup);

  return entity;
}
