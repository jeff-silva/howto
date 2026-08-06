import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { createBulletEntity } from "../entities/BulletEntity";
import { getTerrainHeight } from "../entities/ChunkEntity";

const playerQuery = defineQuery([
  PositionComponent,
  RotationComponent,
  PlayerComponent,
]);

const keys: { [key: string]: boolean } = {};
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

export let isShooting = false;
window.addEventListener("mousedown", (e) => {
  if (e.button === 0) isShooting = true; // Botão esquerdo
});
window.addEventListener("mouseup", (e) => {
  if (e.button === 0) isShooting = false;
});

// Helper objects for math
const _euler = new THREE.Euler(0, 0, 0, "YXZ");
const _quaternion = new THREE.Quaternion();
const _direction = new THREE.Vector3();
const _leftWing = new THREE.Vector3();
const _rightWing = new THREE.Vector3();
const _playerPos = new THREE.Vector3();

// Cooldown state
let lastShotTime = 0;
const SHOT_COOLDOWN_MS = 150; // Atira rápido (150ms)

export const playerControlSystem = (world: IWorld) => {
  const ents = playerQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    // Load current rotation
    _quaternion.set(
      RotationComponent.x[eid],
      RotationComponent.y[eid],
      RotationComponent.z[eid],
      RotationComponent.w[eid],
    );
    _euler.setFromQuaternion(_quaternion);

    // Controls
    const pitchSpeed = 0.02;
    const rollSpeed = 0.03;
    const yawSpeed = 0.01;
    // W/S = Pitch (W = up, S = down)
    if (keys["KeyW"]) _euler.x += pitchSpeed;
    if (keys["KeyS"]) _euler.x -= pitchSpeed;

    // Limita o pitch a 45 graus (PI / 4) para cima e para baixo
    const MAX_PITCH = Math.PI / 4;
    _euler.x = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, _euler.x));

    // A/D = Roll & Yaw
    if (keys["KeyA"]) {
      _euler.z += rollSpeed;
      _euler.y += yawSpeed;
    }
    if (keys["KeyD"]) {
      _euler.z -= rollSpeed;
      _euler.y -= yawSpeed;
    }

    // Auto stabilize roll a bit
    if (!keys["KeyA"] && !keys["KeyD"]) {
      _euler.z -= _euler.z * 0.05;
    }

    // Apply rotation
    _quaternion.setFromEuler(_euler);
    RotationComponent.x[eid] = _quaternion.x;
    RotationComponent.y[eid] = _quaternion.y;
    RotationComponent.z[eid] = _quaternion.z;
    RotationComponent.w[eid] = _quaternion.w;

    // Movement (Constant speed forward)
    PlayerComponent.speed[eid] = 0.5; // Constant speed

    // Forward vector is -Z in local space
    _direction.set(0, 0, -1).applyQuaternion(_quaternion);

    PositionComponent.x[eid] += _direction.x * PlayerComponent.speed[eid];
    PositionComponent.y[eid] += _direction.y * PlayerComponent.speed[eid];
    PositionComponent.z[eid] += _direction.z * PlayerComponent.speed[eid];

    // Shooting
    if (isShooting) {
      const now = performance.now();
      if (now - lastShotTime > SHOT_COOLDOWN_MS) {
        lastShotTime = now;
        
        _playerPos.set(
          PositionComponent.x[eid],
          PositionComponent.y[eid],
          PositionComponent.z[eid]
        );

        // Deslocamento das asas (ajuste X conforme a largura do avião 3D)
        const wingOffset = 3.5;
        
        _leftWing.set(-wingOffset, -0.2, -1).applyQuaternion(_quaternion).add(_playerPos);
        _rightWing.set(wingOffset, -0.2, -1).applyQuaternion(_quaternion).add(_playerPos);

        createBulletEntity(world, _leftWing, _quaternion);
        createBulletEntity(world, _rightWing, _quaternion);
      }
    }
  }
  return world;
};
