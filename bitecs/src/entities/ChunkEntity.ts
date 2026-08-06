import * as THREE from 'three';
import { addEntity, addComponent, IWorld } from 'bitecs';
import { PositionComponent } from '../components/PositionComponent';
import { RotationComponent } from '../components/RotationComponent';
import { TerrainChunkComponent } from '../components/TerrainChunkComponent';
import { scene, meshMap } from '../engine/GraphicsEngine';
import { createNoise2D } from 'simplex-noise';

// Uma única instância de ruído para todo o terreno
export const terrainNoise2D = createNoise2D();

export const CHUNK_SIZE = 500;
export const CHUNK_SEGMENTS = 40;

const terrainMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  vertexColors: true,
  roughness: 0.9,
  flatShading: true,
});

export function createChunkEntity(world: IWorld, gridX: number, gridZ: number) {
  const entity = addEntity(world);

  addComponent(world, PositionComponent, entity);
  addComponent(world, RotationComponent, entity);
  addComponent(world, TerrainChunkComponent, entity);

  TerrainChunkComponent.gridX[entity] = gridX;
  TerrainChunkComponent.gridZ[entity] = gridZ;

  const posX = gridX * CHUNK_SIZE;
  const posZ = gridZ * CHUNK_SIZE;

  PositionComponent.x[entity] = posX;
  PositionComponent.y[entity] = 0;
  PositionComponent.z[entity] = posZ;

  RotationComponent.x[entity] = 0;
  RotationComponent.y[entity] = 0;
  RotationComponent.z[entity] = 0;
  RotationComponent.w[entity] = 1;

  const geometry = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SEGMENTS, CHUNK_SEGMENTS);
  geometry.rotateX(-Math.PI / 2); // Deita o plano

  const positionAttribute = geometry.attributes.position;
  const colors = [];
  
  const colorLow = new THREE.Color(0x2d4c1e); // Verde escuro
  const colorHigh = new THREE.Color(0x6a8c3a); // Verde claro amarelado

  for (let i = 0; i < positionAttribute.count; i++) {
    // Coordenada global para calcular o ruído corretamente sem emendas
    const vx = positionAttribute.getX(i) + posX;
    const vz = positionAttribute.getZ(i) + posZ;

    let height = 0;
    const frequency = 0.003;
    const amplitude = 40;
    
    height += terrainNoise2D(vx * frequency, vz * frequency) * amplitude;
    height += terrainNoise2D(vx * frequency * 2, vz * frequency * 2) * (amplitude * 0.2);

    positionAttribute.setY(i, height);

    const normalizedHeight = (height + amplitude) / (amplitude * 2);
    const vertexColor = colorLow.clone().lerp(colorHigh, Math.max(0, Math.min(1, normalizedHeight)));
    
    colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, terrainMaterial);
  scene.add(mesh);
  meshMap.set(entity, mesh);

  return entity;
}
