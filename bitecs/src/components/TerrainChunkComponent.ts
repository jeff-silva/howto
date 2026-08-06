import { defineComponent, Types } from "bitecs";

// Identifica uma entidade como sendo um pedaço do terreno
export const TerrainChunkComponent = defineComponent({
  gridX: Types.i32,
  gridZ: Types.i32,
});
