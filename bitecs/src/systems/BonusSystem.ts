import { defineQuery, IWorld, removeEntity } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { BonusComponent } from "../components/BonusComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";
import { getTerrainHeight } from "../entities/ChunkEntity";

const bonusQuery = defineQuery([PositionComponent, BonusComponent]);
const playerQuery = defineQuery([PositionComponent, PlayerComponent]);

export const bonusSystem = (world: IWorld) => {
  const bonuses = bonusQuery(world);
  const players = playerQuery(world);

  for (let i = 0; i < bonuses.length; i++) {
    const eid = bonuses[i];
    
    // Faz o bônus flutuar e cair devagar
    const terrainY = getTerrainHeight(PositionComponent.x[eid], PositionComponent.z[eid]);
    if (PositionComponent.y[eid] > terrainY + 5) {
      PositionComponent.y[eid] -= 0.1; // Cai devagarinho
    }

    // Animação de pulsação/rotação visual no sprite (apenas ajustando escala Y se quiser, mas sprites sempre olham pra câmera)
    const mesh = meshMap.get(eid);
    if (mesh) {
      mesh.position.set(
        PositionComponent.x[eid],
        PositionComponent.y[eid] + Math.sin(performance.now() * 0.005) * 2, // Flutua
        PositionComponent.z[eid]
      );
    }

    // Checa tempo de vida (some após 15 segundos)
    BonusComponent.timer[eid] += 16; // Aproximadamente 16ms por frame
    if (BonusComponent.timer[eid] > 15000) {
      if (mesh) {
        scene.remove(mesh);
        meshMap.delete(eid);
      }
      removeEntity(world, eid);
      continue;
    }

    // Checa colisão com os players
    if (players.length > 0) {
      const playerId = players[0];
      const dx = PositionComponent.x[eid] - PositionComponent.x[playerId];
      const dy = PositionComponent.y[eid] - PositionComponent.y[playerId];
      const dz = PositionComponent.z[eid] - PositionComponent.z[playerId];
      const distSq = dx*dx + dy*dy + dz*dz;
      
      const HITBOX_RADIUS = 15.0; // Pega o bônus se passar perto
      if (distSq < HITBOX_RADIUS * HITBOX_RADIUS) {
        // Coletou o bônus!
        const type = BonusComponent.bonusType[eid];
        if (type === 0) {
          // Sangue (Vida)
          PlayerComponent.hp[playerId] = Math.min(100, PlayerComponent.hp[playerId] + 50);
        } else if (type === 1) {
          // Turbo (Stackável permanentemente até a morte)
          PlayerComponent.speed[playerId] += 0.5;
        } else if (type === 2) {
          // Tiro Dobrado (Infinito até morrer)
          PlayerComponent.doubleShotTimer[playerId] = 1; // 1 significa Ativo
        }

        if (mesh) {
          scene.remove(mesh);
          meshMap.delete(eid);
        }
        removeEntity(world, eid);
      }
    }
  }

  return world;
};
