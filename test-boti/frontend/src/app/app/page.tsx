"use client";

import { useState, useEffect } from "react";
import { widgets, WidgetDefinition } from "../../components/widget";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface ActiveWidget {
  instanceId: string;
  widgetId: string;
  props: Record<string, any>;
  isEditing: boolean;
}

export default function AppPage() {
  const [activeWidgets, setActiveWidgets] = useState<ActiveWidget[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega os widgets salvos no primeiro render
  useEffect(() => {
    const saved = localStorage.getItem("hub_active_widgets");
    if (saved) {
      try {
        setActiveWidgets(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar widgets salvos", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salva sempre que a lista de widgets for alterada
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hub_active_widgets", JSON.stringify(activeWidgets));
    }
  }, [activeWidgets, isLoaded]);

  const addWidget = (widget: WidgetDefinition) => {
    setActiveWidgets((prev) => [
      ...prev,
      {
        instanceId: crypto.randomUUID(),
        widgetId: widget.id,
        props: { ...widget.props },
        isEditing: true,
      },
    ]);
    setIsPickerOpen(false);
  };

  const updateWidgetProps = (instanceId: string, newProps: any) => {
    setActiveWidgets((prev) =>
      prev.map((w) => {
        if (w.instanceId === instanceId) {
          return { ...w, props: newProps, isEditing: false };
        }
        return w;
      }),
    );
  };

  const removeWidget = (instanceId: string) => {
    setActiveWidgets((prev) => prev.filter((w) => w.instanceId !== instanceId));
  };

  const toggleEditWidget = (instanceId: string) => {
    setActiveWidgets((prev) =>
      prev.map((w) => {
        if (w.instanceId === instanceId) {
          return { ...w, isEditing: !w.isEditing };
        }
        return w;
      }),
    );
  };

  return (
    <div className="space-y-6 relative">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Meu Hub</h1>
          <p className="text-zinc-400 mt-1">
            Acompanhe suas ferramentas e utilitários em tempo real.
          </p>
        </div>

        {/* Widget Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Icon icon="material-symbols:add-rounded" height="20" />
            Adicionar
          </button>

          {isPickerOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-10">
              <div className="p-2">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
                  Widgets Disponíveis
                </h3>
                {widgets.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => addWidget(widget)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 flex items-center gap-3 transition-colors"
                  >
                    <Icon icon={widget.icon} width="24" height="24" className="text-zinc-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-zinc-200 text-sm font-medium">
                        {widget.name}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {widget.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {activeWidgets.length === 0 ? (
        <div className="w-full h-64 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
          <p>Nenhum widget adicionado ainda.</p>
          <p className="text-sm mt-1">Clique no botão acima para adicionar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeWidgets.map((activeWidget) => {
            const definition = widgets.find(
              (w) => w.id === activeWidget.widgetId,
            );
            if (!definition) return null;

            const WidgetComponent = definition.component;

            return (
              <div key={activeWidget.instanceId} className="relative group">
                {/* Botões de Ação do Card */}
                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleEditWidget(activeWidget.instanceId)}
                    className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 rounded-md backdrop-blur-sm"
                    title="Configurar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeWidget(activeWidget.instanceId)}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-md backdrop-blur-sm"
                    title="Remover"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>

                {/* Renderização do Widget (Passando as props dinamicamente) */}
                <WidgetComponent
                  {...activeWidget.props}
                  isEditing={activeWidget.isEditing}
                  onSave={(newProps) =>
                    updateWidgetProps(activeWidget.instanceId, newProps)
                  }
                  onRemove={() => removeWidget(activeWidget.instanceId)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
