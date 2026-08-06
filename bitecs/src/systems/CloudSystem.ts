import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { CloudComponent } from "../components/CloudComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { ScaleComponent } from "../components/ScaleComponent";
import { ColorComponent } from "../components/ColorComponent";
import { OpacityComponent } from "../components/OpacityComponent";

const cloudQuery = defineQuery([
  PositionComponent,
  CloudComponent,
  ScaleComponent,
  ColorComponent,
  OpacityComponent,
]);
const playerQuery = defineQuery([
  PositionComponent,
  RotationComponent,
  PlayerComponent,
]);

export const CLOUD_INSTANCES = 50;
export const CLOUD_AREA = 500;
export const CLOUD_FADE_SECONDS = 5;
export const CLOUD_MAX_OPACITY = 0.8;

const CLOUD_FADE_INCREMENT = CLOUD_MAX_OPACITY / (CLOUD_FADE_SECONDS * 60); // Assumindo 60fps
const CLOUD_AREA_HALF = CLOUD_AREA / 2;
const CLOUD_DESPAWN_DISTANCE = CLOUD_AREA;

const _playerPos = new THREE.Vector3();
const _playerQuat = new THREE.Quaternion();
const _cloudPos = new THREE.Vector3();

const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();

export const cloudSystem = (world: IWorld) => {
  const players = playerQuery(world);
  if (players.length === 0) return world;

  const playerEid = players[0];
  _playerPos.set(
    PositionComponent.x[playerEid],
    PositionComponent.y[playerEid],
    PositionComponent.z[playerEid],
  );
  _playerQuat.set(
    RotationComponent.x[playerEid],
    RotationComponent.y[playerEid],
    RotationComponent.z[playerEid],
    RotationComponent.w[playerEid],
  );

  // Calcula vetores locais do avião
  _forward.set(0, 0, -1).applyQuaternion(_playerQuat);
  _right.set(1, 0, 0).applyQuaternion(_playerQuat);
  _up.set(0, 1, 0).applyQuaternion(_playerQuat);

  const clouds = cloudQuery(world);
  for (let i = 0; i < clouds.length; i++) {
    const eid = clouds[i];

    _cloudPos.set(
      PositionComponent.x[eid],
      PositionComponent.y[eid],
      PositionComponent.z[eid],
    );

    if (OpacityComponent.opacity[eid] < CLOUD_MAX_OPACITY) {
      OpacityComponent.opacity[eid] += CLOUD_FADE_INCREMENT;
      if (OpacityComponent.opacity[eid] > CLOUD_MAX_OPACITY) {
        OpacityComponent.opacity[eid] = CLOUD_MAX_OPACITY;
      }
    }

    const distance = _playerPos.distanceTo(_cloudPos);

    if (distance > CLOUD_DESPAWN_DISTANCE) {
      // Vetor base na frente
      const forwardOffset = _forward.clone().multiplyScalar(CLOUD_AREA_HALF);

      // Espalhamento em X e Y baseado em CLOUD_AREA_HALF
      const randomSpreadX = (Math.random() - 0.5) * CLOUD_AREA;
      const randomSpreadY = (Math.random() - 0.5) * (CLOUD_AREA / 2);

      // Combina os vetores para achar o ponto no plano à frente
      const localSpawnVector = forwardOffset
        .add(_right.clone().multiplyScalar(randomSpreadX))
        .add(_up.clone().multiplyScalar(randomSpreadY));

      // Normaliza o vetor e multiplica exatamente por CLOUD_AREA_HALF.
      // Isso força com que TODAS as nuvens apareçam EXATAMENTE na mesma distância do avião (num domo esférico),
      // corrigindo o efeito de parecerem estar a distâncias diferentes.
      localSpawnVector.normalize().multiplyScalar(CLOUD_AREA_HALF);

      const spawnPos = _playerPos.clone().add(localSpawnVector);

      PositionComponent.x[eid] = spawnPos.x;
      PositionComponent.y[eid] = spawnPos.y;
      PositionComponent.z[eid] = spawnPos.z;

      // Novo tamanho aleatório ao reciclar
      const randomScale = 0.5 + Math.random() * 2.5;
      ScaleComponent.x[eid] = randomScale;
      ScaleComponent.y[eid] = randomScale;
      ScaleComponent.z[eid] = randomScale;

      // Nova cor aleatória ao reciclar (agora com cinza mais escuro)
      const grayValue = 0.2 + Math.random() * 0.8;
      ColorComponent.r[eid] = grayValue;
      ColorComponent.g[eid] = grayValue;
      ColorComponent.b[eid] = grayValue;

      // Reseta a opacidade para iniciar o fade-in novamente
      OpacityComponent.opacity[eid] = 0.0;
    }
  }

  return world;
};
