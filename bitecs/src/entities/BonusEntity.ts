import { addEntity, addComponent, IWorld } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { BonusComponent } from "../components/BonusComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";

// Pré-carregando materiais
const textureLoader = new THREE.TextureLoader();

const spriteSangue = new THREE.SpriteMaterial({
  map: textureLoader.load("https://api.iconify.design/mdi/heart.svg?color=red&width=256"),
  color: 0xffffff,
  transparent: true,
  depthTest: false,
});
const spriteTurbo = new THREE.SpriteMaterial({
  map: textureLoader.load("https://api.iconify.design/mdi/rocket-launch.svg?color=orange&width=256"),
  color: 0xffffff,
  transparent: true,
  depthTest: false,
});
const spriteTiro = new THREE.SpriteMaterial({
  map: textureLoader.load("https://api.iconify.design/mdi/ammunition.svg?color=yellow&width=256"),
  color: 0xffffff,
  transparent: true,
  depthTest: false,
});

export function createBonusEntity(world: IWorld, x: number, y: number, z: number, type: number) {
  const entity = addEntity(world);

  addComponent(world, PositionComponent, entity);
  addComponent(world, BonusComponent, entity);

  PositionComponent.x[entity] = x;
  PositionComponent.y[entity] = y;
  PositionComponent.z[entity] = z;

  BonusComponent.bonusType[entity] = type;
  BonusComponent.timer[entity] = 0;

  let mat;
  if (type === 0) mat = spriteSangue;
  else if (type === 1) mat = spriteTurbo;
  else mat = spriteTiro;

  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(10, 10, 1); // Tamanho grande e visível

  scene.add(sprite);
  meshMap.set(entity, sprite);

  return entity;
}
