import { createWorld, pipe } from "bitecs";
import { initGraphics, renderer, scene, camera } from "./engine/GraphicsEngine";
import { initPhysics, physicsWorld } from "./engine/PhysicsEngine";
import { playerControlSystem } from "./systems/PlayerControlSystem";
import { physicsSystem } from "./systems/PhysicsSystem";
import { cloudSystem, CLOUD_INSTANCES } from "./systems/CloudSystem";
import { terrainSystem } from "./systems/TerrainSystem";
import { cameraSystem } from "./systems/CameraSystem";
import { renderSystem } from "./systems/RenderSystem";
import { createF15Entity } from "./entities/F15Entity";
import { createCloudEntity } from "./entities/CloudEntity";

let animationId: number;

async function boot() {
  await initPhysics();
  initGraphics();
  const world = createWorld();
  
  createF15Entity(world);

  // Criar as nuvens iniciais usando a constante
  for (let i = 0; i < CLOUD_INSTANCES; i++) {
    const startX = (Math.random() - 0.5) * 300;
    const startY = 5 + (Math.random() - 0.5) * 40; // Perto da altura do avião
    const startZ = (Math.random() - 0.5) * 300;
    createCloudEntity(world, startX, startY, startZ);
  }
  
  // Pipeline: Input/Controls -> Physics -> Terrain -> Clouds -> Camera -> Render
  const pipeline = pipe(playerControlSystem, physicsSystem, terrainSystem, cloudSystem, cameraSystem, renderSystem);

  let lastTime = performance.now();
  
  function animate() {
    const time = performance.now();
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    physicsWorld.step();
    pipeline(world);
    
    renderer.render(scene, camera);
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
