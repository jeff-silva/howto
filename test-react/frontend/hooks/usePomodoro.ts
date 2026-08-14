"use client";

import { useState, useEffect, useRef } from "react";

const POMODORO_MINUTES = 25;
const POMODORO_SECONDS = POMODORO_MINUTES * 60;

export function usePomodoro() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_SECONDS);
  const [isActive, setIsActive] = useState(false);
  
  // useRef: Guarda uma variável que NÃO causa re-renderização na tela quando muda.
  // Usamos para guardar a "ID" do cronômetro rodando, para conseguirmos pausá-lo depois.
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Se estiver ativo e tiver tempo sobrando...
    if (isActive && timeLeft > 0) {
      
      // Cria um intervalo que desconta 1 segundo a cada 1000 milissegundos
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }

    // Função de Limpeza (Cleanup): Sempre que o componente sair da tela, o React executa
    // isso para matar o intervalo e não deixar "fantasmas" rodando na memória.
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]); // Só recria o Efeito se um desses dois valores mudar

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(POMODORO_SECONDS);
  };

  // Ajuda na hora de jogar na tela do app, formato "25:00"
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return { timeLeft, isActive, start, pause, reset, formattedTime };
}
