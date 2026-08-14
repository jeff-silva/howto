"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";

export function UserProfile() {
  // A MÁGICA AQUI: O componente "puxa" os dados do espaço global sem receber props do pai!
  const { userName, setUserName } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const save = () => {
    setUserName(tempName);
    setIsEditing(false);
  };

  return (
    <div className="absolute top-4 right-4 bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-4 shadow-md z-10">
      {!isEditing ? (
        <>
          <span className="text-slate-200 text-sm">Olá, <strong className="text-blue-400">{userName}</strong>!</span>
          <button onClick={() => setIsEditing(true)} className="text-xs text-slate-400 hover:text-white transition-colors">
            ✏️ Editar
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <input 
            value={tempName} 
            onChange={(e) => setTempName(e.target.value)} 
            className="bg-slate-950 border border-slate-700 text-slate-100 p-1 rounded px-2 w-32 outline-none focus:border-blue-500 text-sm"
            autoFocus
          />
          <button onClick={save} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">
            Salvar
          </button>
        </div>
      )}
    </div>
  );
}
