<template>
  <div
    class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-8 flex flex-col items-center"
  >
    <div class="max-w-4xl w-full">
      <!-- Botão Voltar -->
      <div class="mb-8">
        <button
          @click="goBack"
          class="px-4 py-2 text-xs font-bold rounded-sm border border-white/10 bg-slate-900 text-slate-300 hover:text-white hover:border-purple-500/30 transition-all duration-300 flex items-center gap-2 cursor-pointer"
        >
          ← Voltar ao Catálogo
        </button>
      </div>

      <!-- Estado de Carregamento -->
      <div
        v-if="mdbMovieSelect.busy && !movie"
        class="flex flex-col items-center justify-center py-20 w-full"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        ></div>
        <p class="text-slate-400 mt-4 text-sm font-semibold">
          Carregando detalhes do filme...
        </p>
      </div>

      <!-- Estado de Erro -->
      <div
        v-else-if="mdbMovieSelect.error"
        class="bg-red-500/10 border border-red-500/20 rounded-sm p-6 text-center"
      >
        <h2 class="text-lg font-bold text-red-400 mb-2">
          Erro ao carregar o filme
        </h2>
        <p class="text-slate-400 text-sm mb-4">
          Não foi possível carregar as informações do filme.
        </p>
        <button
          @click="fetchMovie"
          class="px-4 py-2 text-xs font-bold rounded-sm bg-red-600 hover:bg-red-700 text-white transition-all duration-300 cursor-pointer"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Detalhes do Filme -->
      <div
        v-else-if="movie"
        class="bg-slate-900 border border-white/5 rounded-sm overflow-hidden shadow-2xl relative"
      >
        <!-- Overlay de Carregamento secundário -->
        <div
          v-if="mdbMovieSelect.busy"
          class="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10"
        >
          <div
            class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"
          ></div>
        </div>

        <!-- Cabeçalho do Filme -->
        <div class="p-6 md:p-8 border-b border-white/5 bg-slate-950/40">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"
          >
            <div>
              <span
                class="px-2.5 py-1 bg-purple-500/10 border border-purple-500/25 rounded-sm text-[10px] font-bold text-purple-400 uppercase tracking-wider"
              >
                ID: {{ movie.id }}
              </span>
              <h1
                class="text-3xl md:text-4xl font-extrabold text-white mt-2 leading-tight"
              >
                {{ movie.title }}
              </h1>
              <p
                v-if="movie.tagline"
                class="text-purple-400 italic text-sm mt-1"
              >
                "{{ movie.tagline }}"
              </p>
            </div>

            <div class="flex items-center gap-2 self-start md:self-auto">
              <div
                class="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-sm text-center"
              >
                <span
                  class="block text-[10px] uppercase font-bold text-amber-400 tracking-wider"
                  >Nota</span
                >
                <span class="text-2xl font-black text-amber-400">
                  ★
                  {{
                    movie.vote_average
                      ? parseFloat(movie.vote_average).toFixed(1)
                      : "N/A"
                  }}
                </span>
              </div>
              <div
                class="px-4 py-2 bg-slate-800 border border-white/5 rounded-sm text-center"
              >
                <span
                  class="block text-[10px] uppercase font-bold text-slate-400 tracking-wider"
                  >Votos</span
                >
                <span class="text-xl font-bold text-slate-200">
                  {{ movie.vote_count || 0 }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mt-4">
            <span
              v-for="genre in movie.genres"
              :key="genre.id"
              class="px-2.5 py-1 bg-white/5 rounded-sm text-xs text-slate-300 border border-white/5"
            >
              {{ genre.name }}
            </span>
          </div>
        </div>

        <!-- Conteúdo Principal -->
        <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Sinopse e Info Principal -->
          <div class="md:col-span-2 space-y-6">
            <div>
              <h2
                class="text-lg font-bold text-white mb-3 flex items-center gap-2"
              >
                <span class="w-1.5 h-4 bg-purple-500 rounded-sm"></span> Sinopse
              </h2>
              <p
                class="text-slate-300 text-sm leading-relaxed whitespace-pre-line"
              >
                {{
                  movie.overview ||
                  "Nenhuma sinopse disponível para este filme."
                }}
              </p>
            </div>

            <!-- Palavras-chave -->
            <div v-if="movie.keywords && movie.keywords.length > 0">
              <h2
                class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3"
              >
                Palavras-chave
              </h2>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="keyword in movie.keywords"
                  :key="keyword.id"
                  class="px-2 py-0.5 bg-slate-950 text-[10px] text-slate-400 border border-white/5 rounded-sm"
                >
                  #{{ keyword.name }}
                </span>
              </div>
            </div>

            <!-- Elenco -->
            <div
              v-if="movie.credit?.cast && movie.credit.cast.length > 0"
              class="pt-2"
            >
              <h2
                class="text-lg font-bold text-white mb-3 flex items-center gap-2"
              >
                <span class="w-1.5 h-4 bg-purple-500 rounded-sm"></span> Elenco
                principal
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  v-for="(member, idx) in movie.credit.cast.slice(0, 9)"
                  :key="idx"
                  class="bg-slate-900 border border-white/5 p-3 rounded-sm text-left flex flex-col justify-center"
                >
                  <span class="font-bold text-slate-200 text-sm truncate">{{
                    member.name
                  }}</span>
                  <span class="text-slate-400 text-xs truncate mt-0.5">{{
                    member.character
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Equipe Técnica -->
            <div
              v-if="movie.credit?.crew && movie.credit.crew.length > 0"
              class="pt-2"
            >
              <h2
                class="text-lg font-bold text-white mb-3 flex items-center gap-2"
              >
                <span class="w-1.5 h-4 bg-purple-500 rounded-sm"></span> Equipe
                Técnica
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  v-for="(member, idx) in movie.credit.crew.slice(0, 6)"
                  :key="idx"
                  class="bg-slate-900 border border-white/5 p-3 rounded-sm text-left flex flex-col justify-center"
                >
                  <span class="font-bold text-slate-200 text-sm truncate">{{
                    member.name
                  }}</span>
                  <span class="text-purple-400 text-xs font-semibold mt-0.5">{{
                    member.job
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações Técnicas Lateral -->
          <div
            class="bg-slate-950/40 border border-white/5 rounded-sm p-5 space-y-4 text-sm text-slate-400"
          >
            <h2
              class="text-white font-bold text-sm border-b border-white/5 pb-2 uppercase tracking-wider"
            >
              Ficha Técnica
            </h2>

            <div class="space-y-3">
              <div
                class="flex justify-between items-center py-1 border-b border-white/5"
              >
                <span class="font-semibold text-slate-300"
                  >Título Original:</span
                >
                <span
                  class="text-right text-slate-200 truncate max-w-[180px]"
                  >{{ movie.original_title || "N/A" }}</span
                >
              </div>
              <div
                class="flex justify-between items-center py-1 border-b border-white/5"
              >
                <span class="font-semibold text-slate-300"
                  >Idioma Original:</span
                >
                <span class="text-slate-200 uppercase">{{
                  movie.original_language || "N/A"
                }}</span>
              </div>
              <div
                class="flex justify-between items-center py-1 border-b border-white/5"
              >
                <span class="font-semibold text-slate-300">Status:</span>
                <span
                  class="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-sm"
                >
                  {{ movie.status || "N/A" }}
                </span>
              </div>
              <div
                class="flex justify-between items-center py-1 border-b border-white/5"
              >
                <span class="font-semibold text-slate-300">Lançamento:</span>
                <span class="text-slate-200">
                  {{
                    movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("pt-BR")
                      : "N/A"
                  }}
                </span>
              </div>
              <div
                class="flex justify-between items-center py-1 border-b border-white/5"
              >
                <span class="font-semibold text-slate-300">Duração:</span>
                <span class="text-slate-200">
                  {{
                    movie.runtime
                      ? `${Math.floor(movie.runtime / 60)}h ${Math.round(movie.runtime % 60)}m`
                      : "N/A"
                  }}
                </span>
              </div>
              <div
                class="flex justify-between items-center py-1 border-b border-white/5"
              >
                <span class="font-semibold text-slate-300">Orçamento:</span>
                <span class="text-slate-200">
                  {{
                    movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"
                  }}
                </span>
              </div>
              <div
                class="flex justify-between items-center py-1 border-b border-white/5"
              >
                <span class="font-semibold text-slate-300">Receita:</span>
                <span class="text-slate-200">
                  {{
                    movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"
                  }}
                </span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="font-semibold text-slate-300">Popularidade:</span>
                <span class="text-slate-200">
                  {{ movie.popularity ? movie.popularity.toFixed(2) : "N/A" }}
                </span>
              </div>
            </div>

            <!-- Site Oficial -->
            <div
              v-if="movie.homepage"
              class="pt-4 border-t border-white/5 text-center"
            >
              <a
                :href="movie.homepage"
                target="_blank"
                class="block w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-sm transition-all duration-300"
              >
                Visitar Website Oficial
              </a>
            </div>
          </div>
        </div>

        <!-- Produtoras e Países -->
        <div
          class="px-6 md:p-8 pb-8 pt-4 border-t border-white/5 bg-slate-950/20 text-xs text-slate-400 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div
            v-if="
              movie.production_companies &&
              movie.production_companies.length > 0
            "
          >
            <span
              class="font-bold text-slate-300 uppercase tracking-wider block mb-2"
              >Produtoras</span
            >
            <div class="flex flex-wrap gap-2">
              <span
                v-for="company in movie.production_companies"
                :key="company.id"
                class="px-2 py-1 bg-white/5 rounded-sm border border-white/5 text-slate-300"
              >
                {{ company.name }}
              </span>
            </div>
          </div>

          <div
            v-if="
              movie.production_countries &&
              movie.production_countries.length > 0
            "
          >
            <span
              class="font-bold text-slate-300 uppercase tracking-wider block mb-2"
              >Países Produtores</span
            >
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(country, idx) in movie.production_countries"
                :key="idx"
                class="px-2 py-1 bg-white/5 rounded-sm border border-white/5 text-slate-300"
              >
                {{ country.name }} ({{ country.iso_3166_1 }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const route = useRoute();

const mdbMovieSelect = useAxios(
  {
    method: "get",
    url: `/api/mdb_movie/${route.params.id}`,
    params: { with: "credit" },
  },
  {
    response: {
      entity: null,
    },
  },
);

const movie = computed(() => {
  return mdbMovieSelect.response?.entity || null;
});

const goBack = () => {
  navigateTo("/");
};

const fetchMovie = () => {
  mdbMovieSelect.submit();
};

fetchMovie();
</script>
