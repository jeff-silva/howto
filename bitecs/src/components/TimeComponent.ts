import { defineComponent, Types } from "bitecs";

export const TimeComponent = defineComponent({
  // Hora atual do jogo, em formato decimal (0.0 até 24.0)
  timeOfDay: Types.f32,
});
