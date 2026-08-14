"use client";

import { useRef, useEffect } from "react";
import { usePomodoro } from "@/hooks/usePomodoro";

export function PomodoroTimer() {
  // Trazemos nosso Hook customizado (Fase 2)
  const { formattedTime, isActive, start, pause, reset } = usePomodoro();
  
  // useRef 1: O "poder Sênior" de conectar uma variável do JS diretamente a um elemento HTML (a textarea)
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // useRef 2: Guardar se já focamos ou não, para não ficar focando a cada 1 segundo (a cada render)
  const hasFocused = useRef(false);

  // useEffect (com isActive): Dispara toda vez que o isActive mudar (play ou pause)
  useEffect(() => {
    if (isActive && notesRef.current && !hasFocused.current) {
      // Magia do DOM: Focamos automaticamente na área de anotação
      notesRef.current.focus();
      hasFocused.current = true;
    }
    
    if (!isActive) {
      // Quando pausa, a gente reseta a flag para poder focar no próximo play
      hasFocused.current = false;
    }
  }, [isActive]);

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col items-center gap-6 shadow-md">
      <h2 className="text-xl font-bold text-slate-200">Timer de Foco</h2>
      
      <div className={`text-6xl font-mono font-bold tracking-widest ${isActive ? "text-green-400" : "text-blue-400"} transition-colors`}>
        {formattedTime()}
      </div>

      <div className="flex gap-3">
        {!isActive ? (
          <button onClick={start} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow transition-transform active:scale-95">
            ▶ Iniciar
          </button>
        ) : (
          <button onClick={pause} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold shadow transition-transform active:scale-95">
            ⏸ Pausar
          </button>
        )}
        <button onClick={reset} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold shadow transition-transform active:scale-95">
          Zerar
        </button>
      </div>

      {/* Ao injetar o ref={notesRef}, o React amarra essa tag HTML na nossa variável JS */}
      <textarea 
        ref={notesRef}
        placeholder="O que você está estudando? (O foco virá para cá magicamente ao iniciar)..."
        className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-4 rounded-lg h-32 focus:border-blue-500 outline-none transition-colors resize-none"
      />
    </div>
  );
}
