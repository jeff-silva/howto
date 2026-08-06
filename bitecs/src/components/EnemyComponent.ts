import { defineComponent, Types } from "bitecs";

export const EnemyComponent = defineComponent({
  speed: Types.f32,
  state: Types.ui8, // 0 = POS, 1 = ATK, 2 = DODGE, 3 = FALLING, 4 = WRECKED
  targetOffsetX: Types.f32,
  hp: Types.f32,
  timer: Types.f32,
  lastShotTime: Types.f32,
  speedOffset: Types.f32,
});
