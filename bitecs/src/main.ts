import { createWorld, pipe } from "bitecs";
import { initGraphics, renderer, scene, camera } from "./engine/GraphicsEngine";
import { initPhysics, physicsWorld } from "./engine/PhysicsEngine";
import { playerControlSystem } from "./systems/PlayerControlSystem";
import { physicsSystem } from "./systems/PhysicsSystem";
import { cameraSystem } from "./systems/CameraSystem";
import { renderSystem } from "./systems/RenderSystem";
import { createCubeEntity } from "./entities/CubeEntity";
import { createGroundEntity } from "./entities/GroundEntity";
import { createF15Entity } from "./entities/F15Entity";

let animationId: number;

async function boot() {
  await initPhysics();
  initGraphics();
  
  const world = createWorld();
  
  createGroundEntity(world);
  createCubeEntity(world);
  createF15Entity(world);
  
  // Pipeline: Input/Controls -> Physics -> Camera -> Render
  const pipeline = pipe(playerControlSystem, physicsSystem, cameraSystem, renderSystem);

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
