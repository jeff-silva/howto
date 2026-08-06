import { createWorld, pipe } from "bitecs";
import { initGraphics, renderer, scene, camera, enemyCamera } from "./engine/GraphicsEngine";
import { initPhysics, physicsWorld } from "./engine/PhysicsEngine";
import { playerControlSystem } from "./systems/PlayerControlSystem";
import { physicsSystem } from "./systems/PhysicsSystem";
import { enemyAiSystem } from "./systems/EnemyAISystem";
import { bulletSystem } from "./systems/BulletSystem";
import { explosionSystem } from "./systems/ExplosionSystem";
import { cloudSystem, CLOUD_INSTANCES, CLOUD_MIN_HEIGHT, CLOUD_MAX_HEIGHT } from "./systems/CloudSystem";
import { terrainSystem } from "./systems/TerrainSystem";
import { uiSystem } from "./systems/UiSystem";
import { cameraSystem } from "./systems/CameraSystem";
import { renderSystem } from "./systems/RenderSystem";
import { bonusSystem } from "./systems/BonusSystem";
import { createF15Entity } from "./entities/F15Entity";
import { createEnemyEntity } from "./entities/EnemyEntity";
import { createCloudEntity } from "./entities/CloudEntity";
import "./styles/hud.css";

let animationId: number;

async function boot() {
  await initPhysics();
  initGraphics();
  const world = createWorld();
  
  createF15Entity(world);

  // Criar 3 inimigos iniciais espalhados ao redor
  for(let i = 0; i < 3; i++) {
    createEnemyEntity(world, 100 + Math.random() * 100, 50, 100 + Math.random() * 100);
  }

  // Criar as nuvens iniciais usando a constante
  for (let i = 0; i < CLOUD_INSTANCES; i++) {
    const startX = (Math.random() - 0.5) * 300;
    const startY = CLOUD_MIN_HEIGHT + Math.random() * (CLOUD_MAX_HEIGHT - CLOUD_MIN_HEIGHT);
    const startZ = (Math.random() - 0.5) * 300;
    createCloudEntity(world, startX, startY, startZ);
  }
  
  // Pipeline: Input/Controls -> AI -> Bullets -> Physics -> Terrain -> Clouds -> Explosions -> Bonus -> Camera -> Render -> UI
  const pipeline = pipe(playerControlSystem, enemyAiSystem, bulletSystem, physicsSystem, terrainSystem, cloudSystem, explosionSystem, bonusSystem, cameraSystem, renderSystem, uiSystem);

  let lastTime = performance.now();
  
  function animate() {
    const time = performance.now();
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    physicsWorld.step();
    pipeline(world);
    
    // Full screen Main Camera
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    /* FUTURO BONUS: Picture-In-Picture Enemy Camera
    const pipW = window.innerWidth * 0.25;
    const pipH = window.innerHeight * 0.25;
    const margin = 20;
    const pipX = window.innerWidth - pipW - margin;
    const pipY = window.innerHeight - pipH - margin; // Top right in WebGL coordinates
    
    renderer.setViewport(pipX, pipY, pipW, pipH);
    renderer.setScissor(pipX, pipY, pipW, pipH);
    renderer.setScissorTest(true);
    renderer.clearDepth(); // clear depth buffer so it renders on top
    renderer.render(scene, enemyCamera);
    */

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
