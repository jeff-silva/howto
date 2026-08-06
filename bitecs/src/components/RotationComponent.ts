import { defineComponent, Types } from "bitecs";

export const RotationComponent = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32,
  w: Types.f32,
});
