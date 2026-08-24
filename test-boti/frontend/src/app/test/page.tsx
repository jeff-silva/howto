"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@grr.la",
  });

  const mergeUserData = (newData: Partial<typeof userData>) => {
    setUserData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="p-8 bg-zinc-950 text-white min-h-screen">
      <div className="max-w-sm w-full space-y-4">
        <Input
          value={userData.name}
          onChange={(e) => mergeUserData({ name: e.target.value })}
          placeholder="Digite seu nome..."
        />
        <Input
          value={userData.email}
          onChange={(e) => mergeUserData({ email: e.target.value })}
          placeholder="Digite seu nome..."
        />

        <Button className="w-full">Botão de Teste</Button>

        <pre>{JSON.stringify(userData, null, 2)}</pre>
      </div>
    </div>
  );
}
