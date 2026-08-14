"use client";

import { useState, useEffect } from "react";

const QUOTES = [
  "A persistência é o caminho do êxito. - Charles Chaplin",
  "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo. - Winston Churchill",
  "Só sei que nada sei. - Sócrates",
  "A educação é a arma mais poderosa que você pode usar para mudar o mundo. - Nelson Mandela",
  "Não é que eu seja tão inteligente, é que permaneço com os problemas por mais tempo. - Albert Einstein"
];

export function MotivationalQuote() {
  // useState: Guarda a frase na tela
  const [quote, setQuote] = useState("Buscando inspiração nos servidores...");

  // useEffect: Com Array Vazio [], roda apenas 1x quando o componente nasce
  useEffect(() => {
    // Simulando um tempo de carregamento de API (Side Effect)
    const timer = setTimeout(() => {
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setQuote(randomQuote);
    }, 1500);

    return () => clearTimeout(timer);
  }, []); 

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md text-center italic text-slate-400 text-sm animate-pulse-once">
      "{quote}"
    </div>
  );
}
