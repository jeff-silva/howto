import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PlayerComponent } from "../components/PlayerComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { PositionComponent } from "../components/PositionComponent";
import { getTerrainHeight } from "../entities/ChunkEntity";
import { camera } from "../engine/GraphicsEngine";

const playerQuery = defineQuery([PlayerComponent, PositionComponent]);
const enemyQuery = defineQuery([EnemyComponent, PositionComponent]);

const hpBars = new Map<number, HTMLElement>();
const _vec3 = new THREE.Vector3();
const _enemyRawPos = new THREE.Vector3();

let initialized = false;
let altElement: HTMLElement | null = null;
let spdElement: HTMLElement | null = null;
let hpElement: HTMLElement | null = null;
let killsElement: HTMLElement | null = null;
let dmgOverlay: HTMLElement | null = null;
let lastPlayerHp = 100;

function initHud() {
  const hudDiv = document.createElement("div");
  hudDiv.id = "hud";
  hudDiv.innerHTML = `
    <div class="hud-item">
      <span class="hud-label">Altitude</span>
      <span class="hud-value"><span id="alt-val">0</span>m</span>
    <div class="hud-item">
      <span class="hud-label">Kills</span>
      <span class="hud-value"><span id="kills-val">0</span></span>
    </div>
    <div class="hud-item">
      <span class="hud-label">HP</span>
      <span class="hud-value"><span id="hp-val">100</span>%</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Speed</span>
      <span class="hud-value"><span id="spd-val">0</span>km/h</span>
    </div>
  `;
  document.body.appendChild(hudDiv);

  altElement = document.getElementById("alt-val");
  spdElement = document.getElementById("spd-val");
  hpElement = document.getElementById("hp-val");
  killsElement = document.getElementById("kills-val");
  
  dmgOverlay = document.createElement("div");
  dmgOverlay.id = "dmg-overlay";
  dmgOverlay.style.position = "absolute";
  dmgOverlay.style.top = "0";
  dmgOverlay.style.left = "0";
  dmgOverlay.style.width = "100vw";
  dmgOverlay.style.height = "100vh";
  dmgOverlay.style.backgroundColor = "red";
  dmgOverlay.style.opacity = "0";
  dmgOverlay.style.pointerEvents = "none";
  dmgOverlay.style.zIndex = "9999";
  document.body.appendChild(dmgOverlay);

  initialized = true;
}

export const uiSystem = (world: IWorld) => {
  if (!initialized) initHud();

  if (!altElement || !spdElement || !hpElement || !killsElement) return world;

  const players = playerQuery(world);
  if (players.length > 0) {
    const playerEid = players[0];

    // Altura = Distância verdadeira para o solo diretamente abaixo
    const terrainY = getTerrainHeight(PositionComponent.x[playerEid], PositionComponent.z[playerEid]);
    const altitude = PositionComponent.y[playerEid] - terrainY;

    // Velocidade = PlayerComponent.speed (unidades por frame).
    const speed = PlayerComponent.speed[playerEid];
    const kmh = speed * 60 * 3.6;
    
    // Vida do Player
    const playerHp = PlayerComponent.hp[playerEid];

    altElement.innerText = Math.round(Math.max(0, altitude)).toString();
    spdElement.innerText = Math.round(kmh).toString();
    hpElement.innerText = Math.round(Math.max(0, playerHp)).toString();
    killsElement.innerText = PlayerComponent.kills[playerEid].toString();
    
    // Efeito de flash na tela ao tomar dano
    if (playerHp < lastPlayerHp && dmgOverlay) {
      dmgOverlay.style.transition = "none";
      dmgOverlay.style.opacity = "0.4"; // Pisca forte
      
      // Remove no próximo frame para fazer o fade out
      requestAnimationFrame(() => {
        if (dmgOverlay) {
          dmgOverlay.style.transition = "opacity 0.4s ease-out";
          dmgOverlay.style.opacity = "0";
        }
      });
    }
    lastPlayerHp = playerHp;

    // Mostra alerta visual se a vida estiver baixa
    if (playerHp < 30) {
      hpElement.style.color = "red";
    } else {
      hpElement.style.color = "lime";
    }
  }

  // ---- Enemy Health Bars ----
  const enemies = enemyQuery(world);
  const activeEnemies = new Set<number>();

  for (let i = 0; i < enemies.length; i++) {
    const eid = enemies[i];
    activeEnemies.add(eid);

    let hpContainer = hpBars.get(eid);
    if (!hpContainer) {
      // Create new HP bar DOM element
      hpContainer = document.createElement("div");
      hpContainer.className = "enemy-hp-container";
      
      const hpInner = document.createElement("div");
      hpInner.className = "enemy-hp-bar";
      hpContainer.appendChild(hpInner);
      
      document.body.appendChild(hpContainer);
      hpBars.set(eid, hpContainer);
    }

    // Update HP width (assuming Max HP = 100)
    const hpInner = hpContainer.firstChild as HTMLElement;
    const currentHp = EnemyComponent.hp[eid];
    hpInner.style.width = `${Math.max(0, currentHp)}%`;
    
    // Position the health bar above the enemy's 3D position
    // We add 8 unidades no eixo Y para ficar "em cima" do modelo do avião
    _enemyRawPos.set(PositionComponent.x[eid], PositionComponent.y[eid], PositionComponent.z[eid]);
    _vec3.copy(_enemyRawPos).y += 8;
    
    // Distância real entre a câmera e o inimigo
    const dist = camera.position.distanceTo(_enemyRawPos);
    
    // Cálculo de escala da barrinha:
    // Digamos que a 50 unidades de distância ela tem 100px.
    const baseWidth = 100;
    const baseDist = 50;
    let computedWidth = baseWidth * (baseDist / dist);
    
    // Trava para não ficar menor que 50px nem maior que 150px
    computedWidth = Math.max(50, Math.min(150, computedWidth));
    hpContainer.style.width = `${computedWidth}px`;

    _vec3.project(camera);

    // Convert Normalized Device Coordinates [-1, 1] to pixel screen coordinates
    const x = (_vec3.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(_vec3.y * 0.5) + 0.5) * window.innerHeight;

    // Se o Z for maior que 1, o objeto está atrás da câmera e não deve ser exibido
    if (_vec3.z > 1 || currentHp <= 0) {
      hpContainer.style.display = 'none';
    } else {
      hpContainer.style.display = 'block';
      hpContainer.style.left = `${x}px`;
      hpContainer.style.top = `${y}px`;
    }
  }

  // Remove as barrinhas de inimigos que já foram deletados (se no futuro implementarmos a destruição)
  for (const [eid, hpContainer] of hpBars.entries()) {
    if (!activeEnemies.has(eid)) {
      hpContainer.remove();
      hpBars.delete(eid);
    }
  }

  return world;
};
