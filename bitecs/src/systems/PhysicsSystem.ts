import { defineQuery, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { bodyMap } from "../engine/PhysicsEngine";

const physicsQuery = defineQuery([PositionComponent, RotationComponent]);

export const physicsSystem = (world: IWorld) => {
  const ents = physicsQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    const body = bodyMap.get(eid);
    if (body) {
      const translation = body.translation();
      const rotation = body.rotation();

      PositionComponent.x[eid] = translation.x;
      PositionComponent.y[eid] = translation.y;
      PositionComponent.z[eid] = translation.z;

      RotationComponent.x[eid] = rotation.x;
      RotationComponent.y[eid] = rotation.y;
      RotationComponent.z[eid] = rotation.z;
      RotationComponent.w[eid] = rotation.w;
    }
  }

  return world;
};
