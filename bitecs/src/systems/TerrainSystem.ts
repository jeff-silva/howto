import { defineQuery, IWorld, removeEntity } from 'bitecs';
import { PlayerComponent } from '../components/PlayerComponent';
import { PositionComponent } from '../components/PositionComponent';
import { TerrainChunkComponent } from '../components/TerrainChunkComponent';
import { createChunkEntity, CHUNK_SIZE } from '../entities/ChunkEntity';
import { meshMap, scene } from '../engine/GraphicsEngine';

const playerQuery = defineQuery([PlayerComponent, PositionComponent]);
const chunkQuery = defineQuery([TerrainChunkComponent]);

// Rastreia os chunks já instanciados pela sua coordenada "x,z"
const activeChunks = new Set<string>();

export const terrainSystem = (world: IWorld) => {
  const players = playerQuery(world);
  if (players.length === 0) return world;

  const playerEid = players[0];
  const playerX = PositionComponent.x[playerEid];
  const playerZ = PositionComponent.z[playerEid];

  // Calcula em qual célula do grid o jogador está agora
  const currentGridX = Math.round(playerX / CHUNK_SIZE);
  const currentGridZ = Math.round(playerZ / CHUNK_SIZE);

  // Mantemos um grid 3x3 ao redor do jogador (radius = 1)
  const radius = 1;
  const desiredChunks = new Set<string>();

  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      const gridX = currentGridX + x;
      const gridZ = currentGridZ + z;
      desiredChunks.add(`${gridX},${gridZ}`);
    }
  }

  // 1. Cria os chunks que o jogador alcançou mas ainda não existem
  desiredChunks.forEach(chunkKey => {
    if (!activeChunks.has(chunkKey)) {
      const [gridX, gridZ] = chunkKey.split(',').map(Number);
      createChunkEntity(world, gridX, gridZ);
      activeChunks.add(chunkKey);
    }
  });

  // 2. Destrói os chunks que ficaram para trás
  const chunks = chunkQuery(world);
  for (let i = 0; i < chunks.length; i++) {
    const eid = chunks[i];
    const gridX = TerrainChunkComponent.gridX[eid];
    const gridZ = TerrainChunkComponent.gridZ[eid];
    const chunkKey = `${gridX},${gridZ}`;

    if (!desiredChunks.has(chunkKey)) {
      // Remove do rastreador
      activeChunks.delete(chunkKey);
      
      // Limpa os recursos gráficos pesados (geometria) da memória
      const mesh = meshMap.get(eid);
      if (mesh) {
        scene.remove(mesh);
        if ((mesh as any).geometry) (mesh as any).geometry.dispose();
        meshMap.delete(eid);
      }
      
      // Remove a entidade do ECS
      removeEntity(world, eid);
    }
  }

  return world;
};
