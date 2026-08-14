"use client";

import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar nosso valor.
  // Passamos uma função pro useState para que a leitura "cara" do
  // localStorage só aconteça uma vez na primeira renderização da tela.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Erro ao ler localStorage", error);
      return initialValue;
    }
  });

  // Função que usamos para salvar o valor (substitui o setState padrão do React)
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que o value seja uma função (igual a API nativa do useState permite)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
        
      // Salva no estado do React (para a tela atualizar na hora)
      setStoredValue(valueToStore);
      
      // Salva fisicamente no navegador (para não perder ao dar F5)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn("Erro ao salvar no localStorage", error);
    }
  };

  return [storedValue, setValue] as const;
}
