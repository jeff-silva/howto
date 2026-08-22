import WeatherWidget from '../../components/widget/weather';

export default function AppPage() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Meu Hub</h1>
        <p className="text-zinc-400 mt-1">Acompanhe suas ferramentas e utilitários em tempo real.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeatherWidget />
        {/* Futuros widgets irão aqui */}
      </div>
    </div>
  );
}
