import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { TimeComponent } from "../components/TimeComponent";
import { skyUniforms, dirLight, ambientLight, scene } from "../engine/GraphicsEngine";

const timeQuery = defineQuery([TimeComponent]);

const dayAmbient = new THREE.Color(0xffffff);
const nightAmbient = new THREE.Color(0x111122); // Escurecendo um pouco mais a luz ambiente também
const dayFog = new THREE.Color(0x4a72a8); // Azul mais escuro e encorpado para o horizonte
const nightFog = new THREE.Color(0x050a18); // Preto azulado (Midnight Blue) para mesclar com o céu noturno
const dayDir = new THREE.Color(0xffffee);
const nightDir = new THREE.Color(0x5555aa);

export const environmentSystem = (world: IWorld) => {
  const ents = timeQuery(world);
  if (ents.length === 0) return world;

  const eid = ents[0];

  // 1 frame = 1 game second = 1/3600 of a game hour (at 60fps)
  TimeComponent.timeOfDay[eid] += 1 / 3600;

  if (TimeComponent.timeOfDay[eid] >= 24.0) {
    TimeComponent.timeOfDay[eid] -= 24.0;
  }

  const t = TimeComponent.timeOfDay[eid];
  let blend = 0.0;

  // Calcula o blend: 0 = Dia puro, 1 = Noite pura
  // Amanhecer entre 05:00 e 07:00
  // Anoitecer entre 17:00 e 19:00
  if (t >= 7 && t <= 17) {
    blend = 0.0; // Dia
  } else if (t >= 19 || t <= 5) {
    blend = 1.0; // Noite
  } else if (t > 5 && t < 7) {
    blend = 1.0 - (t - 5) / 2.0; // Amanhecendo (fade out noite)
  } else if (t > 17 && t < 19) {
    blend = (t - 17) / 2.0; // Anoitecendo (fade in noite)
  }

  // Atualiza Skybox
  if (skyUniforms) {
    skyUniforms.blend.value = blend;
  }

  // Atualiza Luzes
  if (dirLight && ambientLight) {
    // Sol é mais fraco e azulado a noite
    dirLight.intensity = THREE.MathUtils.lerp(2.0, 0.3, blend);
    dirLight.color.copy(dayDir).lerp(nightDir, blend);
    
    // Luz ambiente escurece
    ambientLight.color.copy(dayAmbient).lerp(nightAmbient, blend);
  }

  // Atualiza a Névoa (para o horizonte mesclar perfeitamente com o céu)
  if (scene.fog instanceof THREE.FogExp2) {
    scene.fog.color.copy(dayFog).lerp(nightFog, blend);
  }

  return world;
};
