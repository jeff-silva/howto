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
  {
    id: "joke",
    icon: "mdi:emoticon-happy-outline",
    name: "Jokes",
    description: "Piada aleatória",
    component: dynamic(() => import("./joke")),
    props: {},
  },
  {
    id: "ip",
    icon: "mdi:web",
    name: "Meu IP",
    description: "Seu IP público e localização",
    component: dynamic(() => import("./ip")),
    props: {},
  },
  {
    id: "agify",
    icon: "mdi:face-man-profile",
    name: "Nome & Idade",
    description: "Descubra a idade e nacionalidade pelo nome",
    component: dynamic(() => import("./agify")),
    props: {},
  },
  {
    id: "zippopotam",
    icon: "mdi:map-search-outline",
    name: "Busca CEP",
    description: "Consulta de CEP usando Zippopotam",
    component: dynamic(() => import("./zippopotam")),
    props: {},
  },
];
