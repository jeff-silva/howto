'use client';

import { useQuery } from '@tanstack/react-query';

export default function WeatherWidget() {
  const { data: weather, isLoading: loading, isError } = useQuery({
    queryKey: ['weather', 'saopaulo'],
    queryFn: async () => {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=-23.5489&longitude=-46.6388&current_weather=true'
      );
      if (!res.ok) throw new Error('Erro na rede');
      const data = await res.json();
      return data.current_weather;
    },
    // Magia do TanStack: a cada 5 minutos ele atualiza o clima sozinho, sem o usuário recarregar a tela!
    refetchInterval: 1000 * 60 * 5, 
  });

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
