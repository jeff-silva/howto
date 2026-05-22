<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-8 flex flex-col items-center">
    <div class="max-w-6xl w-full">
      <!-- Cabeçalho -->
      <header class="mb-12 border-b border-white/5 pb-6">
        <h1 class="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          MovieDB - Catálogo de Filmes
        </h1>
        <p class="text-slate-400 mt-2 text-sm">
          Exibindo os filmes disponíveis no banco de dados com navegação de páginas (12 por página).
        </p>
      </header>

      <!-- Grid de Filmes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="movie in movies" 
          :key="movie.id" 
          class="bg-slate-900 border border-white/5 rounded-sm overflow-hidden hover:border-purple-500/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
        >
          <!-- Informações do Filme -->
          <div class="p-5 text-left">
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-2.5 py-1 bg-purple-500/10 border border-purple-500/25 rounded-sm text-[10px] font-bold text-purple-400 uppercase">
                ID: {{ movie.id }}
              </span>
              <span class="flex items-center gap-1 text-xs font-bold text-amber-400">
                ★ {{ movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }}
              </span>
            </div>
            <h2 class="text-lg font-bold text-white mb-2 leading-tight line-clamp-1">
              {{ movie.title }}
            </h2>
            <p class="text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">
              {{ movie.overview || 'Sem sinopse disponível.' }}
            </p>
          </div>

          <!-- Ficha Técnica -->
          <div class="px-5 pb-5 pt-3 border-t border-white/5 bg-slate-950/40 text-xs text-slate-400 flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-slate-300">Ano:</span>
              <span>{{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold text-slate-300">Duração:</span>
              <span>{{ movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${Math.round(movie.runtime % 60)}m` : 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-semibold text-slate-300">Orçamento:</span>
              <span>{{ movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A' }}</span>
            </div>
            <div class="mt-2 pt-2 border-t border-white/5">
              <span class="font-semibold text-slate-300 block mb-1">Gêneros:</span>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(genre, idx) in formatGenres(movie.genres)" 
                  :key="idx"
                  class="px-1.5 py-0.5 bg-white/5 rounded-sm text-[10px] text-slate-300 border border-white/5"
                >
                  {{ genre }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação Simples e Elegante -->
      <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8">
        <p class="text-xs sm:text-sm text-slate-400">
          Mostrando <span class="text-white font-bold">{{ (currentPage - 1) * 12 + 1 }}</span> a 
          <span class="text-white font-bold">{{ Math.min(currentPage * 12, totalMovies) }}</span> de 
          <span class="text-white font-bold">{{ totalMovies }}</span> filmes.
        </p>

        <div class="flex items-center gap-2">
          <button
            @click="loadPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 text-xs font-bold rounded-sm border border-white/10 bg-slate-900 text-slate-300 hover:text-white hover:border-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
          >
            Anterior
          </button>

          <div class="flex items-center gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="loadPage(page)"
              :class="[
                'w-9 h-9 text-xs font-bold rounded-sm transition-all duration-300 cursor-pointer',
                currentPage === page
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="loadPage(currentPage + 1)"
            :disabled="currentPage * 12 >= totalMovies"
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
const supabase = useSupabase();
const mdbMovieList = await supabase.movieSearch({ per_page: 12 });

const movies = ref(mdbMovieList?.data || []);
const currentPage = ref(1);
const totalMovies = ref(mdbMovieList?.count || 4803);

const totalPages = computed(() => Math.ceil(totalMovies.value / 12));

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const loadPage = async (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  try {
    const res = await supabase.movieSearch({ page, per_page: 12 });
    movies.value = res.data || [];
  } catch (err) {
    console.error("Erro ao carregar a página:", err);
  }
};

const formatGenres = (genres) => {
  if (!genres) return [];
  if (Array.isArray(genres)) {
    return genres.map(g => typeof g === 'object' ? (g.name || '') : g).filter(Boolean);
  }
  return [];
};
</script>
