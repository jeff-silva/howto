import { defineComponent, Types } from 'bitecs';

export const BulletComponent = defineComponent({
  distanceTraveled: Types.f32,
  speed: Types.f32,
  isEnemy: Types.ui8,
});
