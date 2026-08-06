import * as THREE from "three";
import { defineQuery, IWorld, hasComponent } from "bitecs";
import { PositionComponent } from "../components/PositionComponent";
import { RotationComponent } from "../components/RotationComponent";
import { ScaleComponent } from "../components/ScaleComponent";
import { ColorComponent } from "../components/ColorComponent";
import { OpacityComponent } from "../components/OpacityComponent";
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

      if (hasComponent(world, ScaleComponent, eid)) {
        mesh.scale.set(
          ScaleComponent.x[eid],
          ScaleComponent.y[eid],
          ScaleComponent.z[eid]
        );
      }

      if (hasComponent(world, ColorComponent, eid)) {
        if (mesh instanceof THREE.Group) {
          mesh.children.forEach((child: THREE.Object3D) => {
            if ((child as THREE.Sprite).material) {
              (child as THREE.Sprite).material.color.setRGB(
                ColorComponent.r[eid],
                ColorComponent.g[eid],
                ColorComponent.b[eid]
              );
              if (hasComponent(world, OpacityComponent, eid)) {
                (child as THREE.Sprite).material.opacity = OpacityComponent.opacity[eid];
              }
            }
          });
        } else if ((mesh as THREE.Mesh).material) {
           ((mesh as THREE.Mesh).material as THREE.Material & { color: THREE.Color }).color?.setRGB(
              ColorComponent.r[eid],
              ColorComponent.g[eid],
              ColorComponent.b[eid]
           );
           if (hasComponent(world, OpacityComponent, eid)) {
             ((mesh as THREE.Mesh).material as THREE.Material & { opacity: number }).opacity = OpacityComponent.opacity[eid];
           }
        }
      }
    }
  }

  return world;
};
