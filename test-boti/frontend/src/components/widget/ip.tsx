"use client";

import { useEffect, useState } from "react";
import { WidgetBaseProps } from "./index";
import { Icon } from "@iconify/react";

interface IpData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
  error?: boolean;
  reason?: string;
}

export default function IpWidget({
  isEditing,
  onSave,
  onRemove,
  ...props
}: WidgetBaseProps) {
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIpData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) {
        throw new Error("Failed to fetch IP data");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.reason || "Error from API");
      }
      setIpData(data);
    } catch (err: any) {
      console.error("Failed to fetch IP:", err);
      setError(err.message || "Erro ao carregar dados do IP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpData();
  }, []);

  return (
    <div className="relative h-full flex flex-col p-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[200px] justify-between">
      <div className="absolute top-3 left-4 flex items-center gap-2 text-zinc-500">
        <Icon icon="mdi:web" className="text-lg" />
        <span className="text-xs font-semibold uppercase tracking-wider">Conexão Atual</span>
      </div>

      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          onClick={fetchIpData}
          disabled={loading}
          className="p-2 bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50"
          title="Atualizar IP"
        >
          <Icon
            icon="mdi:refresh"
            className={`text-lg ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center mt-6 mb-4">
        {loading && !ipData ? (
          <div className="flex items-center justify-center space-x-2 animate-pulse text-zinc-500">
            <Icon icon="mdi:loading" className="animate-spin text-2xl" />
            <span>Verificando...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-red-400 h-full">
            <Icon icon="mdi:alert-circle-outline" className="text-3xl mb-2" />
            <p className="text-sm text-center">{error}</p>
          </div>
        ) : ipData ? (
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-zinc-500 mb-1">Seu IP Público</span>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-bold text-emerald-400 tracking-tight">
                  {ipData.ip}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full mt-2 border-t border-zinc-800/50 pt-4">
              <div className="flex items-start gap-2">
                <Icon icon="mdi:map-marker-outline" className="text-zinc-500 mt-0.5 text-lg" />
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500">Localização</span>
                  <span className="text-sm font-medium text-zinc-200">
                    {ipData.city}, {ipData.region}
                  </span>
                  <span className="text-xs text-zinc-400">{ipData.country_name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Icon icon="mdi:server-network-outline" className="text-zinc-500 mt-0.5 text-lg" />
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500">Provedor (ISP)</span>
                  <span className="text-sm font-medium text-zinc-200 truncate max-w-[120px]" title={ipData.org}>
                    {ipData.org}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
