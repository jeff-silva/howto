'use client';

import { useEffect, useState } from 'react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usando a API gratuita do Open-Meteo (não precisa de chave)
    // Coordenadas de exemplo (São Paulo)
    async function fetchWeather() {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-23.5489&longitude=-46.6388&current_weather=true'
        );
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Erro ao buscar clima:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full max-w-sm shadow-lg flex flex-col items-center justify-center min-h-[160px] transition-all hover:border-zinc-700">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-zinc-400 font-medium text-sm">São Paulo, SP</h3>
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
