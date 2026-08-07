import { defineQuery, IWorld } from "bitecs";
import * as THREE from "three";
import { PlayerComponent } from "../components/PlayerComponent";
import { EnemyComponent } from "../components/EnemyComponent";
import { PositionComponent } from "../components/PositionComponent";
import { getTerrainHeight } from "../entities/TerrainEntity";
import { camera } from "../engine/GraphicsEngine";
import { TimeComponent } from "../components/TimeComponent";

const playerQuery = defineQuery([PlayerComponent, PositionComponent]);
const enemyQuery = defineQuery([EnemyComponent, PositionComponent]);
const timeQuery = defineQuery([TimeComponent]);

const hpBars = new Map<number, HTMLElement>();
const _vec3 = new THREE.Vector3();
const _enemyRawPos = new THREE.Vector3();

let initialized = false;
let altElement: HTMLElement | null = null;
let spdElement: HTMLElement | null = null;
let distElement: HTMLElement | null = null;
let timeElement: HTMLElement | null = null;
let hpElement: HTMLElement | null = null;
let killsElement: HTMLElement | null = null;
let dmgOverlay: HTMLElement | null = null;
let lastPlayerHp = 100;

function initHud(world: IWorld) {
  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

    #hud {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 30px;
      font-family: 'Share Tech Mono', monospace;
      color: #33ff33;
      background: rgba(0, 20, 0, 0.4);
      border: 1px solid rgba(51, 255, 51, 0.3);
      border-left: 4px solid #33ff33;
      border-right: 4px solid #33ff33;
      padding: 15px 40px;
      pointer-events: none;
      user-select: none;
      text-shadow: 0 0 8px rgba(51, 255, 51, 0.6);
      box-shadow: 0 4px 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(51,255,51,0.1);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    .hud-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .hud-item.hud-primary {
      min-width: 120px;
    }
    .hud-item.hud-primary .hud-value {
      font-size: 36px;
      line-height: 1.1;
      text-shadow: 0 0 10px rgba(51, 255, 51, 0.9);
    }
    .hud-item.hud-primary .hud-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.9;
      margin-bottom: 2px;
    }

    .hud-divider {
      width: 2px;
      background: rgba(51, 255, 51, 0.4);
      margin: 0 10px;
    }

    .hud-secondary-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      gap: 4px;
    }

    .hud-item.hud-secondary {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: flex-end;
      min-width: 100px;
      gap: 8px;
    }
    .hud-item.hud-secondary .hud-value {
      font-size: 16px;
      line-height: 1;
      opacity: 0.9;
    }
    .hud-item.hud-secondary .hud-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.6;
      margin-bottom: 0;
    }

    /* Barrinhas de Vida dos Inimigos */
    .enemy-hp-container {
      position: absolute;
      width: 40px;
      height: 6px;
      background-color: #880000;
      border: 1px solid #000;
      transform: translate(-50%, -50%); /* Centraliza exato no ponto 2D */
      pointer-events: none;
      border-radius: 3px;
      overflow: hidden;
    }

    .enemy-hp-bar {
      height: 100%;
      background-color: #00ff00;
      width: 100%;
      transition: width 0.1s linear;
    }
  `;
  document.head.appendChild(style);

  const hudDiv = document.createElement("div");
  hudDiv.id = "hud";
  hudDiv.innerHTML = `
    <div class="hud-item hud-primary">
      <span class="hud-label">Speed</span>
      <span class="hud-value"><span id="spd-val">0</span><span style="font-size:16px;">km/h</span></span>
    </div>
    <div class="hud-item hud-primary">
      <span class="hud-label">Altitude</span>
      <span class="hud-value"><span id="alt-val">0</span><span style="font-size:16px;">m</span></span>
    </div>
    <div class="hud-item hud-primary">
      <span class="hud-label">Kills</span>
      <span class="hud-value" id="kills-val">0</span>
    </div>

    <div class="hud-divider"></div>

    <div class="hud-secondary-container">
      <div class="hud-item hud-secondary">
        <span class="hud-label">HP:</span>
        <span class="hud-value"><span id="hp-val">100</span>%</span>
      </div>
      <div class="hud-item hud-secondary">
        <span class="hud-label">DIST:</span>
        <span class="hud-value"><span id="dist-val">0</span>m</span>
      </div>
      <div class="hud-item hud-secondary">
        <span class="hud-label">TIME:</span>
        <span class="hud-value" id="time-val">00:00</span>
      </div>
    </div>
  `;
  document.body.appendChild(hudDiv);

  const debugDiv = document.createElement("div");
  debugDiv.innerHTML = `
    <div id="debug-controls" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px; color: white; display: flex; flex-direction: column; gap: 5px; font-family: monospace; pointer-events: auto; z-index: 10000;">
      <div style="font-size: 12px; margin-bottom: 5px; color: #ffeb3b; text-align: center;">⚙️ DEBUG CHEATS</div>
      <div style="display: flex; gap: 5px;">
        <button id="btn-wpn-sub" style="padding: 5px 10px; cursor: pointer; background: #333; color: white; border: 1px solid #555;">- WPN</button>
        <button id="btn-wpn-add" style="padding: 5px 10px; cursor: pointer; background: #333; color: white; border: 1px solid #555;">+ WPN</button>
      </div>
      <div style="display: flex; gap: 5px;">
        <button id="btn-spd-sub" style="padding: 5px 10px; cursor: pointer; background: #333; color: white; border: 1px solid #555;">- SPD</button>
        <button id="btn-spd-add" style="padding: 5px 10px; cursor: pointer; background: #333; color: white; border: 1px solid #555;">+ SPD</button>
      </div>
      <div style="display: flex; gap: 5px; margin-top: 5px; border-top: 1px solid #444; padding-top: 5px;">
        <button id="btn-time-add" style="flex: 1; padding: 5px 10px; cursor: pointer; background: #333; color: white; border: 1px solid #555;">+ 1 HORA</button>
      </div>
    </div>
  `;
  document.body.appendChild(debugDiv);

  document.getElementById("btn-wpn-add")?.addEventListener("click", () => {
    const players = playerQuery(world);
    if (players.length > 0) PlayerComponent.weaponLevel[players[0]]++;
  });
  document.getElementById("btn-wpn-sub")?.addEventListener("click", () => {
    const players = playerQuery(world);
    if (players.length > 0) PlayerComponent.weaponLevel[players[0]] = Math.max(1, PlayerComponent.weaponLevel[players[0]] - 1);
  });
  document.getElementById("btn-spd-add")?.addEventListener("click", () => {
    const players = playerQuery(world);
    if (players.length > 0) PlayerComponent.speed[players[0]] += 0.5;
  });
  document.getElementById("btn-spd-sub")?.addEventListener("click", () => {
    const players = playerQuery(world);
    if (players.length > 0) PlayerComponent.speed[players[0]] = Math.max(0.5, PlayerComponent.speed[players[0]] - 0.5);
  });
  document.getElementById("btn-time-add")?.addEventListener("click", () => {
    const times = timeQuery(world);
    if (times.length > 0) {
      TimeComponent.timeOfDay[times[0]] = (TimeComponent.timeOfDay[times[0]] + 1.0) % 24.0;
    }
  });

  altElement = document.getElementById("alt-val");
  spdElement = document.getElementById("spd-val");
  distElement = document.getElementById("dist-val");
  timeElement = document.getElementById("time-val");
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
  if (!initialized) initHud(world);

  if (!altElement || !spdElement || !distElement || !timeElement || !hpElement || !killsElement) return world;

  const times = timeQuery(world);
  if (times.length > 0) {
    const timeOfDay = TimeComponent.timeOfDay[times[0]];
    const hours = Math.floor(timeOfDay);
    const minutes = Math.floor((timeOfDay - hours) * 60);
    const hStr = hours.toString().padStart(2, '0');
    const mStr = minutes.toString().padStart(2, '0');
    timeElement.innerText = `${hStr}:${mStr}`;
  }

  const players = playerQuery(world);
  if (players.length > 0) {
    const playerEid = players[0];

    // Altura = Distância verdadeira para o solo diretamente abaixo
    const terrainY = getTerrainHeight(PositionComponent.x[playerEid], PositionComponent.z[playerEid]);
    const altitude = PositionComponent.y[playerEid] - terrainY;

    // Velocidade = PlayerComponent.speed (unidades por frame).
    const speed = PlayerComponent.speed[playerEid];
    const kmh = speed * 60 * 3.6;
    
    // Distância Percorrida
    const distance = PlayerComponent.distance[playerEid];
    
    // Vida do Player
    const playerHp = PlayerComponent.hp[playerEid];

    altElement.innerText = Math.round(Math.max(0, altitude)).toString();
    spdElement.innerText = Math.round(kmh).toString();
    if (distance >= 1000) {
      distElement.innerText = (distance / 1000).toFixed(1) + "k";
    } else {
      distElement.innerText = Math.round(distance).toString();
    }
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
