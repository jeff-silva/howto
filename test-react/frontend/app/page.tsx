import { MotivationalQuote } from "@/components/MotivationalQuote";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { CourseManager } from "@/components/CourseManager";
import { UserProfile } from "@/components/UserProfile";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12 font-sans selection:bg-blue-500 selection:text-white">
      <UserProfile />
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="text-center pt-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text tracking-tight">
            StudyHub
          </h1>
          <p className="text-slate-400 mt-3 font-medium text-lg">
            Domine o React e o seu foco.
          </p>
        </header>

        {/* 1. Componente da Frase (useEffect) */}
        <MotivationalQuote />

        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start pt-6">
          {/* 2. Componente do Cronômetro (useRef) */}
          <PomodoroTimer />
          
          {/* 3. Componente de Cursos (useState e useMemo) */}
          <CourseManager />
        </div>

      </div>
    </main>
  );
}
