import { defineComponent, Types } from "bitecs";

export const PlayerComponent = defineComponent({
  speed: Types.f32,
  hp: Types.f32,
  kills: Types.ui32,
  state: Types.ui8,
  weaponLevel: Types.ui32,
  distance: Types.f32,
});
