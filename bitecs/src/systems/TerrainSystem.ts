import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { TerrainComponent } from "../components/TerrainComponent";
import { getTerrainHeight, TERRAIN_SEGMENT_SIZE, TERRAIN_MAX_HEIGHT } from "../entities/TerrainEntity";
import { meshMap } from "../engine/GraphicsEngine";

const playerQuery = defineQuery([PlayerComponent, PositionComponent]);
const terrainQuery = defineQuery([TerrainComponent]);

export const terrainSystem = (world: IWorld) => {
  const players = playerQuery(world);
  const terrains = terrainQuery(world);

  if (players.length === 0 || terrains.length === 0) return world;

  const playerEid = players[0];
  const playerX = PositionComponent.x[playerEid];
  const playerZ = PositionComponent.z[playerEid];

  const terrainEid = terrains[0];
  
  // Snap the position to the grid to prevent "swimming" of vertices
  const snappedX = Math.floor(playerX / TERRAIN_SEGMENT_SIZE) * TERRAIN_SEGMENT_SIZE;
  const snappedZ = Math.floor(playerZ / TERRAIN_SEGMENT_SIZE) * TERRAIN_SEGMENT_SIZE;

  // Só recalcula se andamos uma distância de pelo menos 1 segmento (snap mudou)
  if (TerrainComponent.lastSnappedX[terrainEid] !== snappedX || TerrainComponent.lastSnappedZ[terrainEid] !== snappedZ) {
    TerrainComponent.lastSnappedX[terrainEid] = snappedX;
    TerrainComponent.lastSnappedZ[terrainEid] = snappedZ;

    const mesh = meshMap.get(terrainEid) as THREE.Mesh;
    if (mesh && mesh.geometry) {
      mesh.position.set(snappedX, 0, snappedZ);

      const geometry = mesh.geometry as THREE.PlaneGeometry;
      const positionAttribute = geometry.attributes.position;
      const colorAttribute = geometry.attributes.color;

      for (let i = 0; i < positionAttribute.count; i++) {
        // Coordenada global real do vértice
        const vx = positionAttribute.getX(i) + snappedX;
        const vz = positionAttribute.getZ(i) + snappedZ;

        const height = getTerrainHeight(vx, vz);
        const amplitude = TERRAIN_MAX_HEIGHT; // Usado para calcular a cor

        positionAttribute.setY(i, height);

        // Mapeia altura para cores
        let vertexColor = new THREE.Color();
        const normalizedHeight = height / amplitude;

        const colorLow = new THREE.Color(0x2d4c1e); // Verde escuro (vales)
        const colorMid = new THREE.Color(0x5a4d3a); // Marrom rochoso (encostas médias)
        const colorHigh = new THREE.Color(0xdddddd); // Neve (picos)

        if (normalizedHeight < 0.3) {
          const t = normalizedHeight / 0.3;
          vertexColor.copy(colorLow).lerp(colorMid, t);
        } else if (normalizedHeight < 0.7) {
          const t = (normalizedHeight - 0.3) / 0.4;
          vertexColor.copy(colorMid).lerp(colorHigh, t);
        } else {
          vertexColor.copy(colorHigh);
        }

        colorAttribute.setXYZ(i, vertexColor.r, vertexColor.g, vertexColor.b);
      }

      geometry.computeVertexNormals();
      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;
    }
  }

  return world;
};
