import { defineQuery, IWorld, removeEntity } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { ExplosionComponent } from "../components/ExplosionComponent";
import { OpacityComponent } from "../components/OpacityComponent";
import { scene, meshMap } from "../engine/GraphicsEngine";

const explosionQuery = defineQuery([ExplosionComponent, OpacityComponent, PositionComponent, VelocityComponent]);

export const explosionSystem = (world: IWorld) => {
  const explosions = explosionQuery(world);

  for (let i = 0; i < explosions.length; i++) {
    const eid = explosions[i];

    ExplosionComponent.lifetime[eid] -= 1;

    // Apply gravity
    VelocityComponent.y[eid] += ExplosionComponent.gravity[eid];

    // Update position
    PositionComponent.x[eid] += VelocityComponent.x[eid];
    PositionComponent.y[eid] += VelocityComponent.y[eid];
    PositionComponent.z[eid] += VelocityComponent.z[eid];

    // Fade out
    const lifeRatio = ExplosionComponent.lifetime[eid] / ExplosionComponent.maxLifetime[eid];
    OpacityComponent.opacity[eid] = Math.max(0, lifeRatio);

    if (ExplosionComponent.lifetime[eid] <= 0) {
      const mesh = meshMap.get(eid);
      if (mesh) {
        scene.remove(mesh);
        if ((mesh as any).material) {
            // Se fosse material único nós daríamos dispose, mas é compartilhado.
        }
        meshMap.delete(eid);
      }
      removeEntity(world, eid);
    }
  }

  return world;
};
