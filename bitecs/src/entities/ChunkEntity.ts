import * as THREE from "three";
import { addEntity, addComponent, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { TerrainChunkComponent } from "../components/TerrainChunkComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";
import { createNoise2D } from "simplex-noise";

// Uma única instância de ruído para todo o terreno
export const terrainNoise2D = createNoise2D();

export function getTerrainHeight(vx: number, vz: number): number {
  const frequency = 0.003; // Montanhas mais "apertadas" e próximas umas das outras
  const amplitude = 200; // Colinas médias

  let noise = terrainNoise2D(vx * frequency, vz * frequency); // [-1, 1]
  
  // Normaliza pra [0, 1] e eleva a uma potência suave para criar morros
  let n = (noise + 1) / 2;
  n = Math.pow(n, 2); // Morros abaulados

  let height = n * amplitude;

  // Ruído secundário para dar textura (rugosidade) ao longo das encostas
  height += terrainNoise2D(vx * frequency * 4, vz * frequency * 4) * 20;
  
  return height;
}

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

  const geometry = new THREE.PlaneGeometry(
    CHUNK_SIZE,
    CHUNK_SIZE,
    CHUNK_SEGMENTS,
    CHUNK_SEGMENTS,
  );
  geometry.rotateX(-Math.PI / 2); // Deita o plano

  const positionAttribute = geometry.attributes.position;
  const colors = [];

  for (let i = 0; i < positionAttribute.count; i++) {
    // Coordenada global para calcular o ruído corretamente sem emendas
    const vx = positionAttribute.getX(i) + posX;
    const vz = positionAttribute.getZ(i) + posZ;

    const height = getTerrainHeight(vx, vz);
    const amplitude = 200; // Usado para calcular a cor

    positionAttribute.setY(i, height);

    // Mapeia altura para cores
    let vertexColor = new THREE.Color();
    const normalizedHeight = height / amplitude;

    const colorLow = new THREE.Color(0x2d4c1e); // Verde escuro (vales)
    const colorMid = new THREE.Color(0x5a4d3a); // Marrom rochoso (encostas médias)
    const colorHigh = new THREE.Color(0xdddddd); // Neve (picos)

    if (normalizedHeight < 0.3) {
      // De 0 a 0.3 -> Verde a Marrom
      const t = normalizedHeight / 0.3;
      vertexColor.copy(colorLow).lerp(colorMid, t);
    } else if (normalizedHeight < 0.7) {
      // De 0.3 a 0.7 -> Marrom a Neve
      const t = (normalizedHeight - 0.3) / 0.4;
      vertexColor.copy(colorMid).lerp(colorHigh, t);
    } else {
      // Acima de 0.7 -> Neve sólida
      vertexColor.copy(colorHigh);
    }

    colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry, terrainMaterial);
  mesh.receiveShadow = true;

  scene.add(mesh);
  meshMap.set(entity, mesh);

  return entity;
}
