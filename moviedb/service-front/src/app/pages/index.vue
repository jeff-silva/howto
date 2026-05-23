<template>
  <div
    class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-8 flex flex-col items-center"
  >
    <div class="max-w-6xl w-full">
      <!-- Cabeçalho -->
      <header class="mb-12 border-b border-white/5 pb-6">
        <h1
          class="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
        >
          MovieDB - Catálogo de Filmes
        </h1>
        <p class="text-slate-400 mt-2 text-sm">
          Exibindo os filmes disponíveis no banco de dados com navegação de
          páginas (12 por página).
        </p>
      </header>

      <!-- Busca Semântica -->
      <div class="relative w-full max-w-2xl mb-12">
        <span
          class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
        >
          <Icon name="lucide:search" class="h-5 w-5 text-purple-400" />
        </span>
        <input
          v-model="mdbMovieSearch.params.search"
          type="text"
          placeholder="Digite sinopse, gênero ou tema"
          class="input input-bordered w-full pl-12 pr-4 py-6 bg-slate-900/40 border-purple-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-xl rounded"
          @input="
            () => {
              mdbMovieSearch.params.page = 1;
              mdbMovieSearch.run();
            }
          "
        />
      </div>

      <!-- <div>{{ mdbMovieSearch.response.sql }}</div> -->

      <!-- Grid de Filmes -->
      <div
        v-if="
          mdbMovieSearch.busy &&
          (!mdbMovieSearch.response?.data ||
            mdbMovieSearch.response.data.length === 0)
        "
        class="flex flex-col items-center justify-center py-20 w-full"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        ></div>
        <p class="text-slate-400 mt-4 text-sm font-semibold">
          Carregando catálogo...
        </p>
      </div>

      <div
        v-else
        class="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <!-- Loading Overlay if updating -->
        <div
          v-if="mdbMovieSearch.busy"
          class="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-sm"
        >
          <div
            class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"
          ></div>
        </div>

        <div
          v-for="movie in mdbMovieSearch.response?.data || []"
          :key="movie.id"
          class="bg-slate-900 border border-white/5 rounded-sm overflow-hidden hover:border-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 shadow-xl flex flex-col justify-between group"
        >
          <!-- Capa do Filme -->
          <div
            class="relative h-48 w-full bg-slate-950/80 overflow-hidden border-b border-white/5 flex items-center justify-center group/image"
          >
            <img
              v-if="movie.image"
              :src="movie.image"
              :alt="movie.original_title"
              class="w-full h-full object-cover group-hover/image:scale-[1.04] transition-transform duration-500 ease-out"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-slate-700 gap-1.5 bg-gradient-to-b from-slate-900 to-slate-950"
            >
              <Icon name="lucide:image" class="h-8 w-8 text-slate-800" />
              <span
                class="text-[9px] uppercase font-bold tracking-wider text-slate-600"
                >Sem Imagem</span
              >
            </div>

            <!-- Badges Flutuantes -->
            <div
              class="absolute top-2.5 inset-x-2.5 flex justify-between items-center pointer-events-none"
            >
              <!-- Ano -->
              <span
                v-if="movie.release_date"
                class="bg-slate-950/85 backdrop-blur-md text-[10px] font-bold text-slate-300 px-2 py-0.5 rounded-sm border border-white/5 tracking-wider shadow-md"
              >
                {{ new Date(movie.release_date).getFullYear() }}
              </span>
              <span v-else></span>

              <!-- Média de Votos -->
              <span
                class="bg-slate-950/85 backdrop-blur-md text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-sm border border-white/5 flex items-center gap-1 shadow-md"
              >
                ★
                {{
                  movie.vote_average
                    ? parseFloat(movie.vote_average).toFixed(1)
                    : "N/A"
                }}
              </span>
            </div>
          </div>

          <!-- Informações do Filme -->
          <div class="p-5 text-left flex-1 flex flex-col justify-between">
            <div>
              <nuxt-link :to="`/movie/${movie.id}`" class="group/title block">
                <h2
                  class="text-base font-bold text-white mb-2 leading-tight line-clamp-1 group-hover/title:text-purple-400 transition-colors duration-300"
                  :title="movie.original_title"
                >
                  {{ movie.original_title }}
                </h2>
              </nuxt-link>
              <p
                class="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed"
              >
                {{ movie.overview || "Sem sinopse disponível." }}
              </p>
            </div>

            <div
              v-if="formatGenres(movie.genres).length > 0"
              class="text-purple-400/60 text-[10px] font-semibold tracking-wide uppercase line-clamp-1 border-t border-white/5 pt-3"
            >
              {{ formatGenres(movie.genres).join(" • ") }}
            </div>
          </div>

          <!-- Ficha Técnica -->
          <div
            class="px-5 pb-5 pt-3 border-t border-white/5 bg-slate-950/40 text-xs text-slate-400 flex flex-col gap-2"
          >
            <div class="flex justify-between items-center">
              <span class="font-semibold text-slate-300">Duração:</span>
              <span>{{
                movie.runtime
                  ? `${Math.floor(movie.runtime / 60)}h ${Math.round(movie.runtime % 60)}m`
                  : "N/A"
              }}</span>
            </div>

            <!-- Ações -->
            <div
              class="mt-3 pt-3 border-t border-white/5 flex justify-end gap-2"
            >
              <!-- Google Search -->
              <a
                :href="`https://www.google.com/search?q=${encodeURIComponent(
                  [
                    movie.original_title,
                    movie.release_date
                      ? '(' + new Date(movie.release_date).getFullYear() + ')'
                      : null,
                  ]
                    .filter((v) => !!v)
                    .join(' '),
                )}`"
                target="_blank"
                title="Pesquisar no Google"
                class="btn btn-circle btn-xs bg-white/5 hover:bg-purple-500/20 border-none text-slate-300 hover:text-purple-400 transition-all duration-300"
                @click.stop
              >
                <Icon name="mdi:google" class="h-3.5 w-3.5" />
              </a>

              <!-- YouTube Search (Trailer) -->
              <a
                :href="`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  [
                    movie.original_title,
                    movie.release_date
                      ? '(' + new Date(movie.release_date).getFullYear() + ')'
                      : null,
                  ]
                    .filter((v) => !!v)
                    .join(' ') + ' trailer',
                )}`"
                target="_blank"
                title="Pesquisar Trailer no YouTube"
                class="btn btn-circle btn-xs bg-white/5 hover:bg-red-500/20 border-none text-slate-300 hover:text-red-500 transition-all duration-300"
                @click.stop
              >
                <Icon name="mdi:youtube" class="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação Simples e Elegante -->
      <div
        class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8"
      >
        <p class="text-xs sm:text-sm text-slate-400">
          Mostrando
          <span class="text-white font-bold">{{
            (mdbMovieSearch.params.page - 1) * 12 + 1
          }}</span>
          a
          <span class="text-white font-bold">{{
            Math.min(
              mdbMovieSearch.params.page * 12,
              mdbMovieSearch.response?.pagination?.results || 0,
            )
          }}</span>
          de
          <span class="text-white font-bold">{{
            mdbMovieSearch.response?.pagination?.results || 0
          }}</span>
          filmes.
        </p>

        <div class="flex items-center gap-2">
          <button
            @click="mdbMovieSearch.pageGoto('-')"
            :disabled="mdbMovieSearch.params.page === 1"
            class="px-4 py-2 text-xs font-bold rounded-sm border border-white/10 bg-slate-900 text-slate-300 hover:text-white hover:border-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            Anterior
          </button>

          <span class="text-xs text-slate-400 font-medium px-2">
            Página {{ mdbMovieSearch.params.page }} de
            {{ mdbMovieSearch.response?.pagination?.pages || 1 }}
          </span>

          <button
            @click="mdbMovieSearch.pageGoto('+')"
            :disabled="
              mdbMovieSearch.params.page >=
              (mdbMovieSearch.response?.pagination?.pages || 0)
            "
            class="px-4 py-2 text-xs font-bold rounded-sm border border-white/10 bg-slate-900 text-slate-300 hover:text-white hover:border-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

const formatGenres = (genres) => {
  if (!genres) return [];
  if (Array.isArray(genres)) {
    return genres
      .map((g) => (typeof g === "object" ? g.name || "" : g))
      .filter(Boolean);
  }
  return [];
};

const mdbMovieSearch = useAxios(
  {
    method: "get",
    url: "/api/mdb_movie",
    params: {
      per_page: 12,
      page: 1,
      ...route.query,
    },
  },
  {
    response: {
      pagination: { results: 0, pages: 0 },
      params: { page: 1 },
      data: [],
    },
    pageGoto(page) {
      if (page == "+") {
        mdbMovieSearch.params.page = Number(mdbMovieSearch.params.page) + 1;
      } else if (page == "-") {
        mdbMovieSearch.params.page = Number(mdbMovieSearch.params.page) - 1;
      }
      mdbMovieSearch.run();
    },
    async run() {
      const resp = await mdbMovieSearch.submit();
      const query = Object.fromEntries(
        Object.entries(resp.data.params).filter((v) => !!v[1]),
      );
      navigateTo({ query });
    },
  },
);

mdbMovieSearch.run();
</script>
