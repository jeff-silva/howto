import { defineQuery, IWorld, removeEntity } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { BulletComponent } from "../components/BulletComponent";
import { ColorComponent } from "../components/ColorComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";
import { getTerrainHeight } from "../entities/ChunkEntity";
import { createExplosionEntity } from "../entities/ExplosionEntity";
import { EnemyComponent } from "../components/EnemyComponent";
import { PlayerComponent } from "../components/PlayerComponent";

const bulletQuery = defineQuery([PositionComponent, RotationComponent, BulletComponent]);
const enemyQuery = defineQuery([PositionComponent, EnemyComponent]);
const playerQuery = defineQuery([PositionComponent, PlayerComponent]);

const _direction = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();

export const bulletSystem = (world: IWorld) => {
  const bullets = bulletQuery(world);

  for (let i = 0; i < bullets.length; i++) {
    const eid = bullets[i];

    _quaternion.set(
      RotationComponent.x[eid],
      RotationComponent.y[eid],
      RotationComponent.z[eid],
      RotationComponent.w[eid]
    );

    const speed = BulletComponent.speed[eid];

    // O vetor para frente no referencial local da entidade é o eixo -Z
    _direction.set(0, 0, -1).applyQuaternion(_quaternion);

    PositionComponent.x[eid] += _direction.x * speed;
    PositionComponent.y[eid] += _direction.y * speed;
    PositionComponent.z[eid] += _direction.z * speed;

    BulletComponent.distanceTraveled[eid] += speed;

    // Pisca as cores
    const isEnemy = BulletComponent.isEnemy[eid] === 1;
    if (Math.random() > 0.5) {
      ColorComponent.r[eid] = 1.0;
      ColorComponent.g[eid] = isEnemy ? 0.2 : 1.0;
      ColorComponent.b[eid] = isEnemy ? 0.2 : 1.0;
    } else {
      ColorComponent.r[eid] = 1.0;
      ColorComponent.g[eid] = isEnemy ? 0.0 : 1.0;
      ColorComponent.b[eid] = 0.0;
    }

    // ========== SISTEMA DE COLISÃO ==========
    let collided = false;
    let hitType = "";
    let hitEnemyId = -1;

    // 1. Checa Colisão com o Chão (Terreno)
    const terrainHeight = getTerrainHeight(PositionComponent.x[eid], PositionComponent.z[eid]);
    if (PositionComponent.y[eid] <= terrainHeight) {
      collided = true;
      hitType = "GROUND";
    }

    // 2. Checa Colisão com Inimigos (se for bala do player)
    if (!collided && BulletComponent.isEnemy[eid] === 0) {
      const enemies = enemyQuery(world);
      const HITBOX_RADIUS = 3.0; // Distância mínima para acerto (O avião mede uns 2/3 de raio)
      
      for (let j = 0; j < enemies.length; j++) {
        const enemyId = enemies[j];
        
        // Teorema de Pitágoras no 3D pra checar distância
        const dx = PositionComponent.x[eid] - PositionComponent.x[enemyId];
        const dy = PositionComponent.y[eid] - PositionComponent.y[enemyId];
        const dz = PositionComponent.z[eid] - PositionComponent.z[enemyId];
        const distanceSq = dx*dx + dy*dy + dz*dz;
        
        if (distanceSq <= HITBOX_RADIUS * HITBOX_RADIUS) {
          collided = true;
          hitType = "ENEMY";
          hitEnemyId = enemyId;
          break; // Sai do loop pois a bala já bateu
        }
      }
    }

    // 3. Checa Colisão com o Player (se for bala inimiga)
    if (!collided && BulletComponent.isEnemy[eid] === 1) {
      const players = playerQuery(world);
      const HITBOX_RADIUS = 8.0; // Hitbox do player é maior pra compensar a velocidade absurda das balas e a dificuldade da IA
      for (let j = 0; j < players.length; j++) {
        const playerId = players[j];
        
        const dx = PositionComponent.x[eid] - PositionComponent.x[playerId];
        const dy = PositionComponent.y[eid] - PositionComponent.y[playerId];
        const dz = PositionComponent.z[eid] - PositionComponent.z[playerId];
        const distanceSq = dx*dx + dy*dy + dz*dz;
        
        if (distanceSq <= HITBOX_RADIUS * HITBOX_RADIUS) {
          collided = true;
          hitType = "PLAYER";
          hitEnemyId = playerId;
          break;
        }
      }
    }

    // Resolve as consequências da colisão dependendo de onde bateu
    if (collided) {
      if (hitType === "GROUND") {
        // Explode terra pra cima
        createExplosionEntity(world, PositionComponent.x[eid], terrainHeight + 1, PositionComponent.z[eid], "DIRT");
      } else if (hitType === "ENEMY" || hitType === "PLAYER") {
        // Solta faíscas quando a bala acerta algo vivo
        createExplosionEntity(world, PositionComponent.x[eid], PositionComponent.y[eid], PositionComponent.z[eid], "SPARK");
      }
    }

    // Remove a bala da memória se ela bateu em algo ou se voou longe demais
    if (collided || BulletComponent.distanceTraveled[eid] > 500) {
      const mesh = meshMap.get(eid);
      if (mesh) {
        scene.remove(mesh);
        meshMap.delete(eid);
      }

      if (hitType === "ENEMY") {
        EnemyComponent.hp[hitEnemyId] -= 100;
        EnemyComponent.hp[hitEnemyId] = Math.max(0, EnemyComponent.hp[hitEnemyId]);
      } else if (hitType === "PLAYER") {
        // Dano no player!
        PlayerComponent.hp[hitEnemyId] -= 100;
        PlayerComponent.hp[hitEnemyId] = Math.max(0, PlayerComponent.hp[hitEnemyId]);
      }

      removeEntity(world, eid);
    }
  }

  return world;
};
