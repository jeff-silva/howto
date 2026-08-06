import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { camera, enemyCamera } from "../engine/GraphicsEngine";

const playerQuery = defineQuery([
  PositionComponent,
  RotationComponent,
  PlayerComponent,
]);

const enemyQuery = defineQuery([
  PositionComponent,
  RotationComponent,
  EnemyComponent,
]);

const _playerPos = new THREE.Vector3();
const _playerQuat = new THREE.Quaternion();
const _cameraOffset = new THREE.Vector3(0, 7, 15); // Câmera mais acima do avião
const _targetCameraPos = new THREE.Vector3();
const _lookAhead = new THREE.Vector3(0, 0, -20); // Mira um pouco mais longe para compensar a altura
const _lookTarget = new THREE.Vector3();

const _enemyPos = new THREE.Vector3();
const _enemyQuat = new THREE.Quaternion();

export const cameraSystem = (world: IWorld) => {
  const ents = playerQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    _playerPos.set(
      PositionComponent.x[eid],
      PositionComponent.y[eid],
      PositionComponent.z[eid],
    );

    _playerQuat.set(
      RotationComponent.x[eid],
      RotationComponent.y[eid],
      RotationComponent.z[eid],
      RotationComponent.w[eid],
    );

    // Calculate ideal camera position
    _targetCameraPos
      .copy(_cameraOffset)
      .applyQuaternion(_playerQuat)
      .add(_playerPos);

    // Smoothly interpolate camera position
    camera.position.lerp(_targetCameraPos, 0.1);

    // Smoothly look at a point ahead of the player
    _lookTarget.copy(_lookAhead).applyQuaternion(_playerQuat).add(_playerPos);

    // Instead of lerping lookAt which is tricky, we'll just snap the lookAt.
    // The lerped position already makes it smooth enough.
    camera.lookAt(_lookTarget);

    // To make the camera roll with the plane (optional, but requested "look where it's pointing")
    // We can just slerp the camera quaternion directly to the player's quaternion (with offset).
    // For a flight sim, it's often better to just copy the quaternion so the camera rolls too.
    // Let's keep it simple first.
  }

  // ENEMY PIP CAMERA
  const enemies = enemyQuery(world);
  let newestEnemyId = -1;
  for (let i = 0; i < enemies.length; i++) {
    const eid = enemies[i];
    if (EnemyComponent.hp[eid] > 0) {
      if (newestEnemyId === -1 || eid > newestEnemyId) {
        newestEnemyId = eid;
      }
    }
  }

  if (newestEnemyId !== -1) {
    const eid = newestEnemyId;
    _enemyPos.set(PositionComponent.x[eid], PositionComponent.y[eid], PositionComponent.z[eid]);
    _enemyQuat.set(RotationComponent.x[eid], RotationComponent.y[eid], RotationComponent.z[eid], RotationComponent.w[eid]);
    
    // Position enemy camera behind enemy
    const _enemyCameraOffset = new THREE.Vector3(0, 3, 12);
    _targetCameraPos.copy(_enemyCameraOffset).applyQuaternion(_enemyQuat).add(_enemyPos);
    enemyCamera.position.copy(_targetCameraPos);
    
    // Look ahead
    const _enemyLookAhead = new THREE.Vector3(0, 0, -10);
    _lookTarget.copy(_enemyLookAhead).applyQuaternion(_enemyQuat).add(_enemyPos);
    enemyCamera.lookAt(_lookTarget);
  }

  return world;
};
