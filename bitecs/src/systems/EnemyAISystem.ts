import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { getTerrainHeight } from "../entities/ChunkEntity";

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

    const state = EnemyComponent.state[eid];
      
      if (state === 0) {
      // 0 = POSITIONING (Mantém distância lateral enquanto avança)
      const side = EnemyComponent.targetOffsetX[eid]; // 1 ou -1
      
      // Mira num ponto infinitamente lá na frente no "trilho" a exatos 75px de distância lateral
      // Se estiver muito perto ou muito longe lateralmente, ele voa em diagonal até chegar em 75px
      _targetPos.copy(_playerPos)
        .addScaledVector(_playerForward, 1000) 
        .addScaledVector(_playerRight, side * 75); 
      
      // Mantém a altura reta
      _targetPos.y = _enemyPos.y;

      // 250px de vantagem para eles terem tempo e espaço de fazer o arco da curva até você
      if (_enemyPos.z < _playerPos.z - 250) {
        EnemyComponent.state[eid] = 1; // ATK
      }
    } else if (state === 1) {
      // 1 = ATTACKING (Mergulho direto no player)
      _targetPos.copy(_playerPos);
      
      const distSq = _enemyPos.distanceToSquared(_playerPos);
      if (distSq < 50 * 50) {
        EnemyComponent.state[eid] = 2; // DODGE
        // Sorteia a direção que ele vai curvar violentamente enquanto sobe
        EnemyComponent.targetOffsetX[eid] = Math.random() > 0.5 ? 1 : -1;
      }
    } else if (state === 2) {
      // 2 = DODGING (Puxar pra cima E curvar)
      const escapeSide = EnemyComponent.targetOffsetX[eid];

      _targetPos.copy(_playerPos)
        .add(new THREE.Vector3(0, 200, 0)) // 200px Acima
        .addScaledVector(_playerRight, escapeSide * 200); // 200px para o lado sorteado

      // Se o inimigo passou o player, reinicia a rotina
      if (_enemyPos.z > _playerPos.z) {
        EnemyComponent.state[eid] = 0; // POS
        // Sorteia novo lado pro corredor da etapa 0
        EnemyComponent.targetOffsetX[eid] = Math.random() > 0.5 ? 1 : -1;
      }
    }

    // Sistema anti-colisão com o chão:
    // Independentemente da etapa atual, se ele estiver a menos de 30px de bater no solo,
    // nós sequestramos a mira dele e jogamos lá para cima para ele dar um puxão desesperado.
    const terrainY = getTerrainHeight(_enemyPos.x, _enemyPos.z);
    if (_enemyPos.y - terrainY < 30) {
      _targetPos.y = _enemyPos.y + 150; 
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

    // Gira suavemente (curvas mais abertas)
    _enemyQuat.slerp(_targetQuat, 0.015);

    RotationComponent.x[eid] = _enemyQuat.x;
    RotationComponent.y[eid] = _enemyQuat.y;
    RotationComponent.z[eid] = _enemyQuat.z;
    RotationComponent.w[eid] = _enemyQuat.w;

    // Movimenta
    const speed = EnemyComponent.speed[eid];
    _forward.set(0, 0, -1).applyQuaternion(_enemyQuat);

    PositionComponent.x[eid] += _forward.x * speed;
    PositionComponent.y[eid] += _forward.y * speed;
    PositionComponent.z[eid] += _forward.z * speed;
  }

  return world;
};
