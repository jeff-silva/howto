import { defineComponent, Types } from "bitecs";

export const EnemyComponent = defineComponent({
  speed: Types.f32,
  state: Types.ui8, // 0 = POS, 1 = ATK, 2 = DODGE
  targetOffsetX: Types.f32 // -100 (left) or 100 (right)
});
