import { defineQuery, IWorld, removeEntity } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { getTerrainHeight } from "../entities/ChunkEntity";
import { createExplosionEntity } from "../entities/ExplosionEntity";
import { createEnemyEntity } from "../entities/EnemyEntity";
import { createBulletEntity } from "../entities/BulletEntity";
import { createBonusEntity } from "../entities/BonusEntity";
import { scene, meshMap } from "../engine/GraphicsEngine";

const playerQuery = defineQuery([PlayerComponent, PositionComponent, RotationComponent]);
const enemyQuery = defineQuery([EnemyComponent, PositionComponent, RotationComponent]);

const _playerPos = new THREE.Vector3();
const _playerQuat = new THREE.Quaternion();
const _playerForward = new THREE.Vector3(0, 0, -1);
const _playerRight = new THREE.Vector3(1, 0, 0);

const _enemyPos = new THREE.Vector3();
const _enemyQuat = new THREE.Quaternion();
const _targetQuat = new THREE.Quaternion();
const _forward = new THREE.Vector3(0, 0, -1);
const _targetPos = new THREE.Vector3();

export const enemyAiSystem = (world: IWorld) => {
  const players = playerQuery(world);
  if (players.length === 0) return world;

  const playerId = players[0];
  _playerPos.set(
    PositionComponent.x[playerId],
    PositionComponent.y[playerId],
    PositionComponent.z[playerId],
  );

  _playerQuat.set(
    RotationComponent.x[playerId],
    RotationComponent.y[playerId],
    RotationComponent.z[playerId],
    RotationComponent.w[playerId],
  );

  _playerForward.set(0, 0, -1).applyQuaternion(_playerQuat);
  _playerRight.set(1, 0, 0).applyQuaternion(_playerQuat);

  const enemies = enemyQuery(world);

  for (let i = 0; i < enemies.length; i++) {
    const eid = enemies[i];

    _enemyPos.set(
      PositionComponent.x[eid],
      PositionComponent.y[eid],
      PositionComponent.z[eid],
    );

    _enemyQuat.set(
      RotationComponent.x[eid],
      RotationComponent.y[eid],
      RotationComponent.z[eid],
      RotationComponent.w[eid],
    );

    let state = EnemyComponent.state[eid];
    const hp = EnemyComponent.hp[eid];

    if (hp <= 0 && state !== 3 && state !== 4) {
      EnemyComponent.state[eid] = 3; // FALLING
      state = 3;

      const players = playerQuery(world);
      if (players.length > 0) {
        PlayerComponent.kills[players[0]] += 1;
      }

      // Dropa um bônus aleatório (33% Sangue, 33% Turbo, 33% Tiro Dobrado)
      const bonusType = Math.floor(Math.random() * 3);
      createBonusEntity(world, _enemyPos.x, _enemyPos.y, _enemyPos.z, bonusType);

      // Avião morto fica preto e solta fumaça
      if (meshMap.has(eid)) {
        const mesh = meshMap.get(eid)!;
        mesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const c = child as THREE.Mesh;
            if (c.material && (c.material as any).color) {
              (c.material as any).color.setHex(0x222222); // Preto carbonizado
            }
          }
        });
      }
    }
      
    const terrainY = getTerrainHeight(_enemyPos.x, _enemyPos.z);

    // ESTADO 4: Destroços no chão
    if (state === 4) {
      PositionComponent.y[eid] = terrainY; // Trava a altura no chão (não cai mais)
      
      const now = performance.now();
      if (now - EnemyComponent.timer[eid] > 3000) { // Fica lá por 3 segundos
        // Apenas remove a geometria e a entidade (a explosão já aconteceu)
        if (meshMap.has(eid)) {
          scene.remove(meshMap.get(eid)!);
          meshMap.delete(eid);
        }
        removeEntity(world, eid);

        const offset = (Math.random() > 0.5 ? 40 : -40) + (Math.random() * 40 - 20);
        createEnemyEntity(world, _playerPos.x + offset, _playerPos.y + 30 + Math.random() * 30, _playerPos.z + 80);
      } else {
        // Solta fumacinha enquanto aguarda a explosão
        if (Math.random() < 0.3) {
          createExplosionEntity(world, _enemyPos.x, _enemyPos.y, _enemyPos.z, "SMOKE");
        }
      }
      continue; // Ignora rotação e avanço, a carcaça está parada
    }

    // Colidir com o chão vira estado 4 instantaneamente
    if (_enemyPos.y <= terrainY + 2) {
      EnemyComponent.hp[eid] = 0;
      EnemyComponent.state[eid] = 4;
      EnemyComponent.timer[eid] = performance.now();
      PositionComponent.y[eid] = terrainY;
      
      // Explosão gigante e fumaça no EXATO momento que bate no chão
      createExplosionEntity(world, _enemyPos.x, _enemyPos.y, _enemyPos.z, "FIREBALL");
      createExplosionEntity(world, _enemyPos.x, _enemyPos.y, _enemyPos.z, "SMOKE");
      createExplosionEntity(world, _enemyPos.x, _enemyPos.y, _enemyPos.z, "SMOKE");
      createExplosionEntity(world, _enemyPos.x, _enemyPos.y, _enemyPos.z, "DIRT"); 
      
      // Pinta de preto caso não estivesse
      if (meshMap.has(eid)) {
        const mesh = meshMap.get(eid)!;
        mesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const c = child as THREE.Mesh;
            if (c.material && (c.material as any).color) {
              (c.material as any).color.setHex(0x222222);
            }
          }
        });
      }
      continue;
    }

    if (state === 0) {
      // 0 = POSITIONING (Mantém distância lateral enquanto avança na mesma direção)
      const side = EnemyComponent.targetOffsetX[eid]; // 1 ou -1
      
      _targetPos.copy(_playerPos)
        .addScaledVector(_playerForward, 1000) 
        .addScaledVector(_playerRight, side * 75); 
      
      _targetPos.y = _enemyPos.y;

      // "ate a distancia ficar maior do que 250px, entao passa para estado 1"
      const dist = _enemyPos.distanceTo(_playerPos);
      if (dist > 250) {
        EnemyComponent.state[eid] = 1; // ATK
      }
    } else if (state === 1) {
      // 1 = ATTACKING (Mira 10px à frente do player para acertar os tiros)
      const pForward = new THREE.Vector3(0, 0, -1).applyQuaternion(_playerQuat);
      _targetPos.copy(_playerPos).add(pForward.multiplyScalar(10));

      // Checa se tá perto pra fugir (Distância menor que 50)
      const dist = _playerPos.distanceTo(_enemyPos);
      if (dist < 50) {
        EnemyComponent.state[eid] = 2; // Muda pra fuga
      } else {
        // Atira apenas se estiver realmente apontando para o player (dot product > 0.9)
        const _quat = new THREE.Quaternion(RotationComponent.x[eid], RotationComponent.y[eid], RotationComponent.z[eid], RotationComponent.w[eid]);
        const enemyForward = new THREE.Vector3(0, 0, -1).applyQuaternion(_quat);
        const toPlayer = _playerPos.clone().sub(_enemyPos).normalize();
        
        if (enemyForward.dot(toPlayer) > 0.9) {
          const now = performance.now();
          if (now - EnemyComponent.lastShotTime[eid] > 1000) { // Um tiro por segundo por inimigo (para não sobrecarregar muito)
            EnemyComponent.lastShotTime[eid] = now;
            
            // Cria os tiros
            const wingOffset = 3.5;
            const _leftWing = new THREE.Vector3();
            const _rightWing = new THREE.Vector3();
            
            _leftWing.set(-wingOffset, -0.2, -1).applyQuaternion(_quat).add(_enemyPos);
            _rightWing.set(wingOffset, -0.2, -1).applyQuaternion(_quat).add(_enemyPos);

            createBulletEntity(world, _leftWing, _quat, true);
            createBulletEntity(world, _rightWing, _quat, true);
          }
        }
      }
    } else if (state === 2) {
      // 2 = LEVANTA VOO (Manebra rápida de subida antes de voltar pro estado 0)
      const escapeSide = EnemyComponent.targetOffsetX[eid];

      _targetPos.copy(_playerPos)
        .add(new THREE.Vector3(0, 200, 0)) // Puxa pra cima (Levanta voo)
        .addScaledVector(_playerRight, escapeSide * 200);

      // Assim que ultrapassar o jogador durante a subida, conclui a volta para o estado 0
      if (_enemyPos.z > _playerPos.z) {
        EnemyComponent.state[eid] = 0; // POS
        EnemyComponent.targetOffsetX[eid] = Math.random() > 0.5 ? 1 : -1;
      }
    } else if (state === 3) {
      // 3 = FALLING (Morrendo em chamas)
      // Aponta para baixo e um pouco pra frente simulando o peso caindo
      _targetPos.copy(_enemyPos);
      _targetPos.y -= 500;
      _targetPos.z += _forward.z * 100;

      // Fumaça saindo do motor enquanto cai
      if (Math.random() < 0.4) {
        createExplosionEntity(world, _enemyPos.x, _enemyPos.y, _enemyPos.z, "SMOKE");
      }
    }

    // Sistema anti-colisão normal para IA viva (Estado 0, 1, 2)
    if (state !== 3 && state !== 4) {
      if (_enemyPos.y - terrainY < 30) {
        _targetPos.y = _enemyPos.y + 150; 
      }
    }

    const _targetForward = new THREE.Vector3().subVectors(_targetPos, _enemyPos).normalize();
    
    // Calcula o quanto o avião está virando para a esquerda/direita
    // O produto vetorial (cross) no eixo Y nos dá essa força de curva
    const cross = new THREE.Vector3().crossVectors(_forward, _targetForward);
    const turnForce = cross.y; 
    
    const m = new THREE.Matrix4();
    m.lookAt(_enemyPos, _targetPos, new THREE.Vector3(0, 1, 0));
    _targetQuat.setFromRotationMatrix(m);

    // Adiciona o "Banking" (Rolagem/Tombo) proporcional à força da curva
    // Jatos chegam a tombar quase 90 graus (Math.PI / 2) em curvas agressivas
    const maxBankAngle = Math.PI * 0.6; 
    const rollAngle = turnForce * maxBankAngle;
    
    // Aplica a rolagem no eixo local Z
    const rollQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rollAngle);
    _targetQuat.multiply(rollQuat);

    // Gira suavemente (curvas mais abertas no estado 0, mais ágeis no ataque)
    const turnSpeed = (state === 1) ? 0.03 : 0.015;
    _enemyQuat.slerp(_targetQuat, turnSpeed);

    RotationComponent.x[eid] = _enemyQuat.x;
    RotationComponent.y[eid] = _enemyQuat.y;
    RotationComponent.z[eid] = _enemyQuat.z;
    RotationComponent.w[eid] = _enemyQuat.w;

    // Movimenta
    const playerSpeed = PlayerComponent.speed[playerId];
    const speed = playerSpeed + EnemyComponent.speedOffset[eid];
    EnemyComponent.speed[eid] = speed; // Salva para caso precise debugar

    _forward.set(0, 0, -1).applyQuaternion(_enemyQuat);

    PositionComponent.x[eid] += _forward.x * speed;
    PositionComponent.y[eid] += _forward.y * speed;
    PositionComponent.z[eid] += _forward.z * speed;
  }

  return world;
};
