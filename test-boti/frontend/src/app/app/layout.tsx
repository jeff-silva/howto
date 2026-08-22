import { Home, Settings, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900/50 border-r border-zinc-800 backdrop-blur-md">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Test Boti
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/app" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium hover:bg-indigo-500/20 transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors">
            <Settings size={20} />
            Configurações
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors cursor-pointer">
            <User size={20} />
            Meu Perfil
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800 flex justify-around items-center h-16 z-50">
        <Link href="/app" className="flex flex-col items-center gap-1 text-indigo-400">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium">Início</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors">
          <Settings size={20} />
          <span className="text-[10px] font-medium">Config</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors">
          <User size={20} />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
