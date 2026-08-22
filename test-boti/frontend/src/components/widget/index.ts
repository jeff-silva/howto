import dynamic from "next/dynamic";
import { ComponentType } from "react";

export interface WidgetDefinition {
  id: string;
  icon: string;
  name: string;
  description: string;
  component: ComponentType<any>;
}

export const widgets: WidgetDefinition[] = [
  {
    id: "weather",
    icon: "mdi:weather-lightning",
    name: "Clima",
    description: "Widget de clima",
    component: dynamic(() => import("./weather")),
  },
];
