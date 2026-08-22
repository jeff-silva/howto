"use client";

import { useState } from "react";
import { WidgetBaseProps } from "./index";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";

interface JokeData {
  error: boolean;
  type: "single" | "twopart";
  joke?: string;
  setup?: string;
  delivery?: string;
}

export default function JokeWidget({
  isEditing,
  onSave,
  onRemove,
  ...props
}: WidgetBaseProps) {
  const [showDelivery, setShowDelivery] = useState(false);

  const { data: joke, isLoading: loading, refetch, isError } = useQuery({
    queryKey: ['joke'],
    queryFn: async () => {
      const res = await fetch(
        "https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit",
      );
      if (!res.ok) throw new Error("Erro ao carregar piada");
      const data = await res.json();
      return data as JokeData;
    },
    refetchOnWindowFocus: false,
  });

  const fetchJoke = () => {
    setShowDelivery(false);
    refetch();
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[200px]">
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          onClick={fetchJoke}
          disabled={loading || isError}
          className="p-2 bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50"
          title="Nova Piada"
        >
          <Icon
            icon="mdi:refresh"
            className={`text-lg ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center space-x-2 animate-pulse text-zinc-500">
          <Icon icon="mdi:loading" className="animate-spin text-2xl" />
          <span>Carregando...</span>
        </div>
      ) : joke && !joke.error && !isError ? (
        <div className="flex flex-col items-center justify-center gap-4 w-full h-full pb-4">
          <div className="bg-indigo-500/10 p-3 rounded-full mb-2">
            <Icon
              icon="mdi:emoticon-lol-outline"
              className="text-3xl text-indigo-400"
            />
          </div>

          {joke.type === "single" ? (
            <p className="text-lg font-medium text-zinc-200">{joke.joke}</p>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-lg font-medium text-zinc-200">{joke.setup}</p>

              {showDelivery ? (
                <p className="text-lg font-bold text-indigo-400 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {joke.delivery}
                </p>
              ) : (
                <button
                  onClick={() => setShowDelivery(true)}
                  className="mt-2 px-5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-sm font-semibold transition-all shadow-sm border border-zinc-700"
                >
                  Revelar resposta 👀
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-zinc-500">
          <Icon icon="mdi:alert-circle-outline" className="text-3xl mb-2" />
          <p>Não foi possível carregar a piada.</p>
        </div>
      )}
    </div>
  );
}
