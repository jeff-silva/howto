import { defineComponent, Types } from "bitecs";

export const BonusComponent = defineComponent({
  bonusType: Types.ui8, // 0 = Sangue, 1 = Turbo, 2 = Tiro Dobrado
  timer: Types.f32,
});
