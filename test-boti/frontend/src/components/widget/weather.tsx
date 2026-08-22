'use client';

import { useQuery } from '@tanstack/react-query';
import { WidgetBaseProps } from './index';
import { useState } from 'react';

export default function WeatherWidget({ lat, lng, isEditing, onSave }: WidgetBaseProps) {
  const [editLat, setEditLat] = useState(lat ?? -23.5489);
  const [editLng, setEditLng] = useState(lng ?? -46.6388);

  const { data: weather, isLoading: loading, isError } = useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: async () => {
      const fetchLat = lat ?? -23.5489;
      const fetchLng = lng ?? -46.6388;
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${fetchLat}&longitude=${fetchLng}&current_weather=true`
      );
      if (!res.ok) throw new Error('Erro na rede');
      const data = await res.json();
      return data.current_weather;
    },
    refetchInterval: 1000 * 60 * 5, 
    enabled: !isEditing, // Não busca dados se estiver em modo de edição
  });

  if (isEditing) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full shadow-lg flex flex-col min-h-[160px] pt-8">
        <h3 className="text-zinc-300 font-medium text-sm mb-4">Configurar Clima</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Latitude</label>
            <input 
              type="number" 
              value={editLat} 
              onChange={(e) => setEditLat(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Longitude</label>
            <input 
              type="number" 
              value={editLng} 
              onChange={(e) => setEditLng(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-indigo-500"
            />
          </div>
          <button 
            onClick={() => onSave?.({ lat: editLat, lng: editLng })}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full shadow-lg flex flex-col items-center justify-center min-h-[160px] transition-all hover:border-zinc-700">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-zinc-400 font-medium text-sm">Clima (Lat: {lat?.toFixed(1) ?? '-23.5'})</h3>
        <span className="text-xs text-zinc-500 font-mono">Open-Meteo</span>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 w-10 bg-zinc-800 rounded-full"></div>
          <div className="space-y-3">
            <div className="h-4 w-20 bg-zinc-800 rounded"></div>
            <div className="h-4 w-12 bg-zinc-800 rounded"></div>
          </div>
        </div>
      ) : weather ? (
        <div className="flex items-center gap-4">
          <div className="text-5xl font-light text-zinc-100">
            {Math.round(weather.temperature)}°
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-300 font-medium text-lg">
              {weather.windspeed > 15 ? 'Ventos Fortes' : 'Tempo Bom'}
            </span>
            <span className="text-zinc-500 text-sm">
              Vento: {weather.windspeed} km/h
            </span>
          </div>
        </div>
      ) : (
        <p className="text-zinc-500 text-sm">Erro ao carregar dados.</p>
      )}
    </div>
  );
}
