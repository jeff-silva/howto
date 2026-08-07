import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { createBulletEntity } from "../entities/BulletEntity";
import { getTerrainHeight } from "../entities/TerrainEntity";
import { createExplosionEntity } from "../entities/ExplosionEntity";

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

    // Checa morte
    const hp = PlayerComponent.hp[eid];
    let state = PlayerComponent.state[eid];

    if (hp <= 0 && state === 0) {
      PlayerComponent.state[eid] = 1;
      state = 1;
      const overlay = document.getElementById("dmg-overlay");
      if (overlay) {
        overlay.style.transition = "none";
        overlay.style.opacity = "0.4"; // Mais transparente
        overlay.style.backgroundColor = "darkred";
      }
    }

    if (state === 1) {
      // Estado morto: mergulha
      _euler.x -= 0.02; // Força pitch para baixo
      _euler.x = Math.max(-Math.PI / 2, _euler.x); // Trava olhando reto pro chão
      _euler.z *= 0.95; // Zera o roll
      _euler.y += 0.01; // Gira sem controle
    } else {
      // Controls
      const pitchSpeed = 0.008;
      const yawSpeed = 0.008;
      const MAX_ROLL = Math.PI / 2;
      let targetRoll = 0;

      // W/S = Pitch (W = up, S = down)
      if (keys["KeyW"]) _euler.x += pitchSpeed;
      if (keys["KeyS"]) _euler.x -= pitchSpeed;

      // Limita o pitch a 45 graus (PI / 4) para cima e para baixo
      const MAX_PITCH = Math.PI / 4;
      _euler.x = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, _euler.x));

      // A/D = Yaw e Target Roll
      if (keys["KeyA"]) {
        targetRoll = MAX_ROLL;
        _euler.y += yawSpeed;
      }
      if (keys["KeyD"]) {
        targetRoll = -MAX_ROLL;
        _euler.y -= yawSpeed;
      }

      // Vira o avião para o ângulo alvo (90 graus ou 0) de forma um pouco mais suave
      _euler.z += (targetRoll - _euler.z) * 0.1;
    }

    // Apply rotation
    _quaternion.setFromEuler(_euler);
    RotationComponent.x[eid] = _quaternion.x;
    RotationComponent.y[eid] = _quaternion.y;
    RotationComponent.z[eid] = _quaternion.z;
    RotationComponent.w[eid] = _quaternion.w;

    // Ticking timers
    // (turboTimer removido, velocidade é permanente até morrer)

    // Forward vector is -Z in local space
    _direction.set(0, 0, -1).applyQuaternion(_quaternion);

    PositionComponent.x[eid] += _direction.x * PlayerComponent.speed[eid];
    PositionComponent.y[eid] += _direction.y * PlayerComponent.speed[eid];
    PositionComponent.z[eid] += _direction.z * PlayerComponent.speed[eid];

    // Odometer
    PlayerComponent.distance[eid] += PlayerComponent.speed[eid];

    // Colisão do player com o chão
    const terrainY = getTerrainHeight(PositionComponent.x[eid], PositionComponent.z[eid]);
    if (PositionComponent.y[eid] <= terrainY + 2) {
      if (state === 1) {
        // Explode
        createExplosionEntity(world, PositionComponent.x[eid], terrainY, PositionComponent.z[eid], "FIREBALL");
        createExplosionEntity(world, PositionComponent.x[eid], terrainY, PositionComponent.z[eid], "SMOKE");
        createExplosionEntity(world, PositionComponent.x[eid], terrainY, PositionComponent.z[eid], "DIRT");

        // Respawn (volta à vida) no céu
        PlayerComponent.hp[eid] = 100;
        PlayerComponent.state[eid] = 0;
        PlayerComponent.weaponLevel[eid] = 1; // Perde upgrades de arma ao morrer
        PlayerComponent.speed[eid] = 1.5; // Reseta velocidade
        PlayerComponent.distance[eid] = 0; // Reseta distância percorrida
        PositionComponent.y[eid] = terrainY + 50; // Renasce a 50px
        _euler.x = 0; // Nariz reto
        _euler.z = 0; // Asas retas
        
        // Atualiza a rotação do respawn
        _quaternion.setFromEuler(_euler);
        RotationComponent.x[eid] = _quaternion.x;
        RotationComponent.y[eid] = _quaternion.y;
        RotationComponent.z[eid] = _quaternion.z;
        RotationComponent.w[eid] = _quaternion.w;

        const overlay = document.getElementById("dmg-overlay");
        if (overlay) {
          overlay.style.transition = "opacity 0.5s";
          overlay.style.opacity = "0";
          overlay.style.backgroundColor = "red";
        }
      } else {
        // Morte instantânea se bater vivo no chão!
        PlayerComponent.hp[eid] = 0;
        PlayerComponent.state[eid] = 1;
        
        // Ativa a tela vermelha da morte
        const overlay = document.getElementById("dmg-overlay");
        if (overlay) {
          overlay.style.transition = "none";
          overlay.style.opacity = "0.4"; // Mais transparente
          overlay.style.backgroundColor = "darkred";
        }
      }
    }

    // Shooting
    if (isShooting && state === 0) {
      const now = performance.now();
      if (now - lastShotTime > SHOT_COOLDOWN_MS) {
        lastShotTime = now;

        _playerPos.set(
          PositionComponent.x[eid],
          PositionComponent.y[eid],
          PositionComponent.z[eid],
        );

        // Deslocamento das asas (ajuste X conforme a largura do avião 3D)
        const wingOffset = 3.5;

        _leftWing
          .set(-wingOffset, -0.2, -1)
          .applyQuaternion(_quaternion)
          .add(_playerPos);
        _rightWing
          .set(wingOffset, -0.2, -1)
          .applyQuaternion(_quaternion)
          .add(_playerPos);

        // Lógica de Tiro com Multiplicador Infinito (Rajada Caótica)
        const level = PlayerComponent.weaponLevel[eid];

        for (let j = 0; j < level; j++) {
          // X aleatório: quanto maior o level, maior a nuvem de tiros horizontal
          const randX = (Math.random() - 0.5) * (level * 1.5); 
          // Y aleatório leve
          const randY = (Math.random() - 0.5) * 1.5; 
          // Z aleatório forte (Staggering) para quebrar totalmente o formato e parecerem atiradas em tempos diferentes
          const staggerZ = Math.random() * 40.0; 

          _leftWing
            .set(-wingOffset + randX, -0.2 + randY, -1 - staggerZ)
            .applyQuaternion(_quaternion)
            .add(_playerPos);

          _rightWing
            .set(wingOffset + randX, -0.2 + randY, -1 - staggerZ)
            .applyQuaternion(_quaternion)
            .add(_playerPos);

          // Levíssima variação no ângulo para dar mais caos
          const randomQuatL = _quaternion.clone().multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler((Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02, 0, 'YXZ'))
          );
          const randomQuatR = _quaternion.clone().multiply(
            new THREE.Quaternion().setFromEuler(new THREE.Euler((Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02, 0, 'YXZ'))
          );

          createBulletEntity(world, _leftWing, randomQuatL);
          createBulletEntity(world, _rightWing, randomQuatR);
        }
      }
    }
  }
  return world;
};
