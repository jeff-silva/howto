"use client";

import { useState } from "react";
import { WidgetBaseProps } from "./index";
import { Icon } from "@iconify/react";

interface ZippopotamData {
  "post code": string;
  country: string;
  "country abbreviation": string;
  places: {
    "place name": string;
    longitude: string;
    state: string;
    "state abbreviation": string;
    latitude: string;
  }[];
}

export default function ZippopotamWidget({
  isEditing,
  onSave,
  onRemove,
  ...props
}: WidgetBaseProps) {
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ZippopotamData | null>(null);
  const [error, setError] = useState(false);

  const formatZip = (value: string) => {
    // Formata como 00000-000 (padrão Brasil) para exibição,
    // mas na api do zippopotam funciona melhor mandar apenas números ou traço
    return value.replace(/\D/g, "").replace(/^(\d{5})(\d{1,3})/, "$1-$2");
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZip(formatZip(e.target.value));
  };

  const fetchData = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zip.replace(/\D/g, ""); // Apenas números
    if (cleanZip.length < 8) return;

    setLoading(true);
    setResult(null);
    setError(false);

    try {
      // Usamos country 'br' (Brasil) e enviamos com o traço como o Zippopotam exige para BR
      const formattedForApi = `${cleanZip.slice(0,5)}-${cleanZip.slice(5,8)}`;
      const res = await fetch(`http://api.zippopotam.us/br/${formattedForApi}`);
      
      if (!res.ok) {
        throw new Error("CEP não encontrado");
      }
      
      const data: ZippopotamData = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Failed to fetch CEP", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col p-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[200px]">
      <div className="absolute top-3 left-4 flex items-center gap-2 text-zinc-500">
        <Icon icon="mdi:map-search-outline" className="text-lg" />
        <span className="text-xs font-semibold uppercase tracking-wider">Busca CEP</span>
      </div>

      <div className="flex-1 flex flex-col justify-center mt-6">
        <form onSubmit={fetchData} className="flex gap-2 w-full mb-4">
          <input
            type="text"
            value={zip}
            onChange={handleZipChange}
            placeholder="Ex: 01000-000"
            maxLength={9}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || zip.replace(/\D/g, "").length < 8}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 text-white rounded-lg px-3 py-2 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <Icon icon="mdi:loading" className="animate-spin text-lg" />
            ) : (
              <Icon icon="mdi:magnify" className="text-lg" />
            )}
          </button>
        </form>

        {error && (
          <div className="text-red-400 text-sm text-center">CEP não encontrado ou inválido.</div>
        )}

        {result && result.places.length > 0 && (
          <div className="flex flex-col gap-2 bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <Icon icon="mdi:map-marker" className="text-indigo-400 text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-zinc-200">
                  {result.places[0]["place name"]}
                </span>
                <span className="text-sm text-zinc-400">
                  {result.places[0].state} ({result.places[0]["state abbreviation"]})
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-700/50">
               <span className="text-xs text-zinc-500">País</span>
               <span className="text-sm font-medium text-zinc-300">{result.country}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
