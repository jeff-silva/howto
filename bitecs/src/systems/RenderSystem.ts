import { defineQuery, IWorld } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { meshMap } from "../engine/GraphicsEngine";

const renderQuery = defineQuery([PositionComponent, RotationComponent]);

export const renderSystem = (world: IWorld) => {
  const ents = renderQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    const mesh = meshMap.get(eid);

    if (mesh) {
      mesh.position.set(PositionComponent.x[eid], PositionComponent.y[eid], PositionComponent.z[eid]);

      mesh.quaternion.set(
        RotationComponent.x[eid],
        RotationComponent.y[eid],
        RotationComponent.z[eid],
        RotationComponent.w[eid],
      );
    }
  }

  return world;
};
