"use client";

import { useState } from "react";
import { WidgetBaseProps } from "./index";
import { Icon } from "@iconify/react";

interface AgifyData {
  age: number | null;
  count: number;
  name: string;
}

interface NationalizeData {
  count: number;
  name: string;
  country: { country_id: string; probability: number }[];
}

export default function AgifyWidget({
  isEditing,
  onSave,
  onRemove,
  ...props
}: WidgetBaseProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ age: number | null; nationality: string | null } | null>(null);

  const fetchData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const [agifyRes, nationalizeRes] = await Promise.all([
        fetch(`https://api.agify.io?name=${encodeURIComponent(name.trim())}`),
        fetch(`https://api.nationalize.io?name=${encodeURIComponent(name.trim())}`),
      ]);

      const agifyData: AgifyData = await agifyRes.json();
      const nationalizeData: NationalizeData = await nationalizeRes.json();

      setResult({
        age: agifyData.age,
        nationality: nationalizeData.country.length > 0 ? nationalizeData.country[0].country_id : null,
      });
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col p-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[200px]">
      <div className="absolute top-3 left-4 flex items-center gap-2 text-zinc-500">
        <Icon icon="mdi:face-man-profile" className="text-lg" />
        <span className="text-xs font-semibold uppercase tracking-wider">Origem do Nome</span>
      </div>

      <div className="flex-1 flex flex-col justify-center mt-6">
        <form onSubmit={fetchData} className="flex gap-2 w-full mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite um nome..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 text-white rounded-lg px-3 py-2 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <Icon icon="mdi:loading" className="animate-spin text-lg" />
            ) : (
              <Icon icon="mdi:magnify" className="text-lg" />
            )}
          </button>
        </form>

        {result && (
          <div className="flex justify-around items-center bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
            <div className="flex flex-col items-center">
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Idade</span>
              <span className="text-2xl font-bold text-zinc-200">
                {result.age ? `${result.age} anos` : "?"}
              </span>
            </div>
            
            <div className="w-px h-10 bg-zinc-700"></div>
            
            <div className="flex flex-col items-center">
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">País</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-zinc-200">
                  {result.nationality || "?"}
                </span>
                {result.nationality && (
                  <img
                    src={`https://flagcdn.com/24x18/${result.nationality.toLowerCase()}.png`}
                    alt={result.nationality}
                    className="rounded-sm"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
