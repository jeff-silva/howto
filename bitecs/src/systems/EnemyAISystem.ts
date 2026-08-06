import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { PlayerComponent } from "../components/PlayerComponent";

const enemyQuery = defineQuery([
  PositionComponent,
  RotationComponent,
  EnemyComponent,
]);
const playerQuery = defineQuery([PositionComponent, PlayerComponent]);

const _playerPos = new THREE.Vector3();
const _enemyPos = new THREE.Vector3();
const _direction = new THREE.Vector3();
const _targetQuat = new THREE.Quaternion();
const _currentQuat = new THREE.Quaternion();
const _forward = new THREE.Vector3();

// Up axis vector
const _up = new THREE.Vector3(0, 1, 0);

export const enemyAiSystem = (world: IWorld) => {
  const players = playerQuery(world);
  if (players.length === 0) return world;

  const playerEid = players[0];
  _playerPos.set(
    PositionComponent.x[playerEid],
    PositionComponent.y[playerEid],
    PositionComponent.z[playerEid],
  );

  const enemies = enemyQuery(world);

  for (let i = 0; i < enemies.length; i++) {
    const eid = enemies[i];

    _enemyPos.set(
      PositionComponent.x[eid],
      PositionComponent.y[eid],
      PositionComponent.z[eid],
    );

    _currentQuat.set(
      RotationComponent.x[eid],
      RotationComponent.y[eid],
      RotationComponent.z[eid],
      RotationComponent.w[eid],
    );

    // Calcular direção desejada
    _direction.subVectors(_playerPos, _enemyPos).normalize();

    // Uma matriz de rotação para olhar para a direção (Note que o forward em Threejs é -Z)
    // O método lookAt constrói uma matriz que olha do primeiro parâmetro para o segundo
    // Mas pra converter rápido para Quaternion:
    const lookAtMatrix = new THREE.Matrix4().lookAt(_enemyPos, _playerPos, _up);
    _targetQuat.setFromRotationMatrix(lookAtMatrix);

    // Como o f15 do nosso jogo está orientado para o -Z local, o lookAt vai orientá-lo corretamente
    // se o eixo for o mesmo, o ThreeJS lookAt assume forward = -Z.

    // Interpolação suave (Slerp)
    // Velocidade de curva: quanto menor, mais tempo demora para virar.
    const turnSpeed = 0.02;
    _currentQuat.slerp(_targetQuat, turnSpeed);

    RotationComponent.x[eid] = _currentQuat.x;
    RotationComponent.y[eid] = _currentQuat.y;
    RotationComponent.z[eid] = _currentQuat.z;
    RotationComponent.w[eid] = _currentQuat.w;

    // Movimento para frente
    const speed = EnemyComponent.speed[eid];
    _forward.set(0, 0, -1).applyQuaternion(_currentQuat);

    PositionComponent.x[eid] += _forward.x * speed;
    PositionComponent.y[eid] += _forward.y * speed;
    PositionComponent.z[eid] += _forward.z * speed;
  }

  return world;
};
