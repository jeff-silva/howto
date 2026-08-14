"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1. Definimos o tipo dos dados que vamos compartilhar globalmente
type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
};

// 2. Criamos o Contexto vazio
const UserContext = createContext<UserContextType | undefined>(undefined);

// 3. Criamos o "Provedor" (O componente que vai abraçar o app inteiro e guardar o estado)
export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState("Estudante");

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}

// 4. Criamos nosso Hook Customizado para facilitar o acesso de qualquer tela
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}
