import { createWorld, pipe } from "bitecs";
import { initGraphics, renderer, scene, camera, controls } from "./engine/GraphicsEngine";
import { initPhysics, physicsWorld } from "./engine/PhysicsEngine";
import { physicsSystem } from "./systems/PhysicsSystem";
import { renderSystem } from "./systems/RenderSystem";
import { createCubeEntity } from "./entities/CubeEntity";
import { createGroundEntity } from "./entities/GroundEntity";

let animationId: number;

async function boot() {
  await initPhysics();
  initGraphics();
  
  const world = createWorld();
  
  createGroundEntity(world);
  createCubeEntity(world);
  
  const pipeline = pipe(physicsSystem, renderSystem);

  function animate() {
    animationId = requestAnimationFrame(animate);
    physicsWorld.step();
    pipeline(world);
    controls.update();
    renderer.render(scene, camera);
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
