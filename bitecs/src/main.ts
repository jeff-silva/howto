import { createWorld, pipe } from "bitecs";
import { initGraphics } from "./engine/GraphicsEngine";
import { initPhysics, physicsWorld } from "./engine/PhysicsEngine";
import { initGame } from "./engine/GameManager";
import { playerControlSystem } from "./systems/PlayerControlSystem";
import { physicsSystem } from "./systems/PhysicsSystem";
import { enemyAiSystem } from "./systems/EnemyAISystem";
import { bulletSystem } from "./systems/BulletSystem";
import { explosionSystem } from "./systems/ExplosionSystem";
import { cloudSystem } from "./systems/CloudSystem";
import { terrainSystem } from "./systems/TerrainSystem";
import { uiSystem } from "./systems/UiSystem";
import { cameraSystem } from "./systems/CameraSystem";
import { renderSystem } from "./systems/RenderSystem";
import { bonusSystem } from "./systems/BonusSystem";
import { environmentSystem } from "./systems/EnvironmentSystem";

let animationId: number;

async function boot() {
  await initPhysics();
  initGraphics();
  
  const world = createWorld();
  
  // Instancia jogador, cenário inicial e inimigos
  initGame(world);
  
  // Pipeline: Input/Controls -> AI -> Bullets -> Physics -> Terrain -> Clouds -> Explosions -> Bonus -> Camera -> Render -> UI
  const pipeline = pipe(
    playerControlSystem, 
    enemyAiSystem, 
    bulletSystem, 
    physicsSystem, 
    terrainSystem, 
    cloudSystem, 
    explosionSystem, 
    bonusSystem, 
    cameraSystem, 
    renderSystem, 
    environmentSystem,
    uiSystem
  );

  function animate() {
    physicsWorld.step();
    pipeline(world);
    animationId = requestAnimationFrame(animate);
  }

  animate();
}

boot();

const hot = (import.meta as any).hot;
if (hot) {
  hot.dispose(() => {
    cancelAnimationFrame(animationId);
  });
}
