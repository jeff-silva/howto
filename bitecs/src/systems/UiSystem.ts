import { defineQuery, IWorld } from "bitecs";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { getTerrainHeight } from "../entities/ChunkEntity";

const playerQuery = defineQuery([PlayerComponent, PositionComponent]);

let initialized = false;
let altElement: HTMLElement | null = null;
let spdElement: HTMLElement | null = null;

function initHud() {
  const hudDiv = document.createElement("div");
  hudDiv.id = "hud";
  hudDiv.innerHTML = `
    <div class="hud-item">
      <span class="hud-label">Altitude</span>
      <span class="hud-value"><span id="alt-val">0</span>m</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Speed</span>
      <span class="hud-value"><span id="spd-val">0</span>km/h</span>
    </div>
  `;
  document.body.appendChild(hudDiv);

  altElement = document.getElementById("alt-val");
  spdElement = document.getElementById("spd-val");
  initialized = true;
}

export const uiSystem = (world: IWorld) => {
  if (!initialized) initHud();

  if (!altElement || !spdElement) return world;

  const players = playerQuery(world);
  if (players.length > 0) {
    const playerEid = players[0];

    // Altura = Distância verdadeira para o solo diretamente abaixo
    const terrainY = getTerrainHeight(PositionComponent.x[playerEid], PositionComponent.z[playerEid]);
    const altitude = PositionComponent.y[playerEid] - terrainY;

    // Velocidade = PlayerComponent.speed (unidades por frame).
    // Supondo 60 frames por segundo: unidades/s = speed * 60.
    // 1 unidade = 1 metro. km/h = (m/s) * 3.6
    const speed = PlayerComponent.speed[playerEid];
    const kmh = speed * 60 * 3.6;

    altElement.innerText = Math.round(Math.max(0, altitude)).toString();
    spdElement.innerText = Math.round(kmh).toString();
  }

  return world;
};
