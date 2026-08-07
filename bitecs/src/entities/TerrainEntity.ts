import * as THREE from "three";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { TerrainComponent } from "../components/TerrainComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";
import { createNoise2D } from "simplex-noise";

// Uma única instância de ruído para todo o terreno
export const TERRAIN_SIZE = 4000; // Tamanho total do quadrado
export const TERRAIN_SEGMENTS = 80; // Quantidade de subdivisões
export const TERRAIN_SEGMENT_SIZE = TERRAIN_SIZE / TERRAIN_SEGMENTS; // O tamanho de cada triângulo
export const TERRAIN_MAX_HEIGHT = 100; // Altura máxima das colinas

export const terrainNoise2D = createNoise2D();

export function getTerrainHeight(vx: number, vz: number): number {
  const frequency = 0.003;
  const amplitude = TERRAIN_MAX_HEIGHT;

  let noise = terrainNoise2D(vx * frequency, vz * frequency);

  let n = (noise + 1) / 2;
  n = Math.pow(n, 1.5);

  let height = n * amplitude;
  height += terrainNoise2D(vx * frequency * 4, vz * frequency * 4) * 20;

  return height;
}

const terrainMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  vertexColors: true,
  roughness: 0.9,
  flatShading: false, // Desliga o estilo "Low-Poly" para um visual suave e arredondado
});

export function createTerrainEntity(world: IWorld) {
  const entity = addEntity(world);

  addComponent(world, PositionComponent, entity);
  addComponent(world, TerrainComponent, entity);

  // Forçamos a atualização no primeiro frame
  TerrainComponent.lastSnappedX[entity] = -999999;
  TerrainComponent.lastSnappedZ[entity] = -999999;

  PositionComponent.x[entity] = 0;
  PositionComponent.y[entity] = 0;
  PositionComponent.z[entity] = 0;

  const geometry = new THREE.PlaneGeometry(
    TERRAIN_SIZE,
    TERRAIN_SIZE,
    TERRAIN_SEGMENTS,
    TERRAIN_SEGMENTS,
  );
  geometry.rotateX(-Math.PI / 2); // Deita o plano

  // Adicionamos cor em branco inicialmente; o sistema que vai preencher
  const colors = new Float32Array(geometry.attributes.position.count * 3);
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mesh = new THREE.Mesh(geometry, terrainMaterial);
  mesh.receiveShadow = true;

  scene.add(mesh);
  meshMap.set(entity, mesh);

  return entity;
}
