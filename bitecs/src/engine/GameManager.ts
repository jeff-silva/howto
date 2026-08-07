import { IWorld, addEntity, addComponent } from "bitecs";
import { createF15Entity } from "../entities/F15Entity";
import { createEnemyEntity } from "../entities/EnemyEntity";
import { createCloudEntity } from "../entities/CloudEntity";
import { createTerrainEntity } from "../entities/TerrainEntity";
import { TimeComponent } from "../components/TimeComponent";
import { CLOUD_INSTANCES, CLOUD_MIN_HEIGHT, CLOUD_MAX_HEIGHT } from "../systems/CloudSystem";

export function initGame(world: IWorld) {
  // Inicializa o Player
  const player = createF15Entity(world);

  // Inicializa o Terreno Infinito
  createTerrainEntity(world);

  // Singleton de Tempo (começa num horário aleatório entre 0h e 24h)
  const timeEntity = addEntity(world);
  addComponent(world, TimeComponent, timeEntity);
  TimeComponent.timeOfDay[timeEntity] = Math.random() * 24.0;

  // Criar inimigos iniciais espalhados aleatoriamente atrás do jogador
  for(let i = 0; i < 3; i++) {
    const spawnX = (Math.random() - 0.5) * 400; // Pode nascer tanto na esquerda quanto na direita
    const spawnZ = 150 + Math.random() * 150; // Sempre atrás do jogador (Z positivo)
    createEnemyEntity(world, spawnX, 80 + Math.random() * 40, spawnZ);
  }

  // pipeline removed
  // Criar as nuvens iniciais
  for (let i = 0; i < CLOUD_INSTANCES; i++) {
    const startX = (Math.random() - 0.5) * 300;
    const startY = CLOUD_MIN_HEIGHT + Math.random() * (CLOUD_MAX_HEIGHT - CLOUD_MIN_HEIGHT);
    const startZ = (Math.random() - 0.5) * 300;
    createCloudEntity(world, startX, startY, startZ);
  }
}
