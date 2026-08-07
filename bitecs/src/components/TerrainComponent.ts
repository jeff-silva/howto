import { defineComponent, Types } from "bitecs";

export const TerrainComponent = defineComponent({
  lastSnappedX: Types.f32,
  lastSnappedZ: Types.f32,
});
