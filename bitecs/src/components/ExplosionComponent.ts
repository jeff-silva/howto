import { defineComponent, Types } from 'bitecs';

export const ExplosionComponent = defineComponent({
  lifetime: Types.f32,
  maxLifetime: Types.f32,
  gravity: Types.f32,
});
