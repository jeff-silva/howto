import dynamic from "next/dynamic";
import { ComponentType } from "react";

export interface WidgetBaseProps {
  isEditing?: boolean;
  onSave?: (newProps: any) => void;
  onRemove?: () => void;
  [key: string]: any;
}

export interface WidgetDefinition {
  id: string;
  icon: string;
  name: string;
  description: string;
  component: ComponentType<WidgetBaseProps>;
  props: Record<string, any>;
}

export const widgets: WidgetDefinition[] = [
  {
    id: "weather",
    icon: "mdi:weather-lightning",
    name: "Clima",
    description: "Widget de clima",
    component: dynamic(() => import("./weather")),
    props: { lat: -23.5489, lng: -46.6388 },
  },
];
