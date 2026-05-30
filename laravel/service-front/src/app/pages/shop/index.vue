<template>
  <div
    class="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased relative overflow-hidden flex flex-col items-center"
  >
    <!-- Glowing background decorative blobs -->
    <div
      class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"
    ></div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div class="max-w-6xl w-full px-4 py-8 relative z-10">
      <!-- Top Navigation bar / Header -->
      <header
        class="mb-10 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3">
            <span
              class="p-2.5 bg-gradient-to-tr from-red-600 to-rose-500 rounded-md text-white shadow-[0_4px_20px_rgba(220,38,38,0.4)] flex items-center justify-center animate-pulse"
            >
              <Icon name="lucide:shopping-bag" class="h-6 w-6" />
            </span>
            <div>
              <span
                class="text-[9px] uppercase font-black tracking-widest text-red-500 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/10 shadow-sm"
                >Deal Zone</span
              >
              <h1
                class="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-rose-500 to-red-400 mt-1"
              >
                the<span class="text-white font-light">store</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <!-- Advanced Filter and Search Section -->
      <div
        class="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-md p-6 mb-10 shadow-2xl"
      >
        <div class="flex flex-col lg:flex-row gap-6 items-stretch">
          <!-- Search Input -->
          <div class="relative flex-1">
            <label
              class="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 block"
              >O que você deseja comprar?</label
            >
            <div class="relative">
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
              >
                <Icon name="lucide:search" class="h-5 w-5 text-red-500/80" />
              </span>
              <input
                v-model="shopProductSearch.params.search"
                type="text"
                placeholder="Busque por produto, marca, categoria ou descrição..."
                class="input w-full pl-12 pr-4 py-6 bg-slate-950/80 border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-300 shadow-inner rounded-md text-sm"
                @input="
                  () => {
                    shopProductSearch.params.page = 1;
                    shopProductSearch.run();
                  }
                "
              />
            </div>
          </div>

          <!-- Quick Navigation tabs -->
          <div class="flex flex-col justify-end">
            <label
              class="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 block"
              >Categorias em Destaque</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categories"
                :key="cat.name"
                @click="setCategory(cat.query)"
                :class="[
                  'px-3.5 py-2.5 rounded-md text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer',
                  currentCategory === cat.query
                    ? 'bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.35)]'
                    : 'bg-slate-950/60 border border-white/5 text-slate-400 hover:text-white hover:border-red-500/20 hover:bg-slate-900',
                ]"
              >
                <Icon :name="cat.icon" class="h-3.5 w-3.5" />
                {{ cat.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Tags search bar suggestions -->
        <div
          class="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-2 items-center"
        >
          <span
            class="text-[10px] uppercase font-black tracking-wider text-slate-500 mr-2"
            >Buscas populares:</span
          >
          <button
            v-for="sug in suggestions"
            :key="sug"
            @click="setSearch(sug)"
            class="px-3 py-1.5 text-xs rounded-lg border border-white/5 bg-slate-950/40 text-slate-400 hover:text-white hover:border-red-500/30 hover:bg-slate-900 transition-all duration-300 cursor-pointer"
          >
            {{ sug }}
          </button>
          <button
            v-if="shopProductSearch.params.search || currentCategory"
            @click="clearFilters()"
            class="px-3 py-1.5 text-xs rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 hover:text-white hover:bg-red-900/40 transition-all duration-300 flex items-center gap-1 cursor-pointer"
          >
            <Icon name="lucide:x" class="h-3.5 w-3.5" />
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="
          shopProductSearch.busy &&
          (!shopProductSearch.response?.data ||
            shopProductSearch.response.data.length === 0)
        "
        class="flex flex-col items-center justify-center py-32 w-full"
      >
        <div class="relative flex items-center justify-center">
          <div
            class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"
          ></div>
          <Icon
            name="lucide:shopping-bag"
            class="h-6 w-6 text-red-500 absolute animate-pulse"
          />
        </div>
        <p
          class="text-slate-400 mt-6 text-sm font-semibold tracking-wider uppercase"
        >
          Carregando Ofertas Imperdíveis...
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="
          !shopProductSearch.response?.data ||
          shopProductSearch.response.data.length === 0
        "
        class="flex flex-col items-center justify-center py-20 w-full text-slate-400 border border-white/5 rounded-md bg-slate-900/10 backdrop-blur-md"
      >
        <div
          class="p-4 bg-slate-900 rounded-full border border-white/5 text-slate-600 mb-4 shadow-inner"
        >
          <Icon name="lucide:shopping-bag" class="h-10 w-10" />
        </div>
        <h3 class="text-lg font-bold text-slate-200">
          Ops! Produto não encontrado
        </h3>
        <p
          class="text-sm text-slate-500 mt-1 max-w-sm text-center leading-relaxed"
        >
          Não conseguimos encontrar nenhum resultado para a sua busca ou filtro.
          Tente usar termos mais genéricos.
        </p>
        <button
          @click="clearFilters()"
          class="mt-6 px-5 py-2.5 text-xs font-bold rounded-md bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-100 transition-all duration-300 cursor-pointer"
        >
          Limpar Filtros & Ver Todos
        </button>
      </div>

      <!-- Catalog Cards Grid -->
      <div v-else class="relative">
        <!-- Transition transparent overlay if busy but showing data -->
        <div
          v-if="shopProductSearch.busy"
          class="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center z-20 rounded-md transition-all duration-300"
        >
          <div class="relative flex items-center justify-center">
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"
            ></div>
          </div>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="product in shopProductSearch.response?.data || []"
            :key="product.id"
            class="flex flex-col bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-red-500/20 rounded-md overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(220,38,38,0.08)] transition-all duration-500 group relative"
          >
            <!-- Image Area with Elegant Aspect and Soft Border -->
            <div
              class="relative w-full aspect-square bg-slate-950 border-b border-white/5 overflow-hidden rounded-t-md flex items-center justify-center group-hover:bg-black/40 transition-colors"
            >
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center text-slate-700 gap-1.5 bg-gradient-to-b from-slate-900 to-slate-950"
              >
                <Icon name="lucide:image" class="h-8 w-8 text-slate-800" />
                <span
                  class="text-[9px] uppercase font-bold tracking-wider text-slate-600 text-center px-2"
                  >Sem Imagem</span
                >
              </div>

              <!-- Top floating tags (Discount Percent or Best Seller status) -->
              <div
                v-if="product.promo_price"
                class="absolute top-3 left-3 z-10 pointer-events-none"
              >
                <span
                  class="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-sm shadow-[0_4px_15px_rgba(220,38,38,0.4)] flex items-center gap-1 uppercase tracking-wider animate-bounce"
                >
                  <Icon name="lucide:percent" class="h-3 w-3" />
                  {{
                    getDiscountPercentage(product.price, product.promo_price)
                  }}% OFF
                </span>
              </div>

              <!-- Best Seller Tag (Simulated based on deterministic sales count) -->
              <div
                v-if="getProductSales(product) > 2800"
                class="absolute top-3 right-3 z-10 pointer-events-none"
              >
                <span
                  class="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm shadow-md uppercase tracking-wider"
                >
                  Mais vendido
                </span>
              </div>
            </div>

            <!-- Content details Area -->
            <div class="p-5 flex flex-col flex-1 justify-between gap-4">
              <div class="flex flex-col gap-1.5">
                <!-- Muted Brand Label above Title -->
                <span
                  class="text-[10px] font-black uppercase tracking-widest text-slate-500"
                >
                  {{ getProductBrand(product) }}
                </span>

                <!-- Title & Link -->
                <h2
                  class="text-sm font-extrabold text-white leading-snug line-clamp-2 h-10 group-hover:text-red-400 transition-colors duration-300"
                  :title="product.name"
                >
                  {{ product.name }}
                </h2>

                <!-- Description -->
                <p
                  class="text-slate-400 text-xs line-clamp-2 leading-relaxed h-8 mt-1"
                >
                  {{ product.description }}
                </p>
              </div>

              <!-- Price & Installments Box Layout -->
              <div
                class="flex flex-col justify-end mt-auto pt-3 border-t border-white/5"
              >
                <!-- Promo Pricing -->
                <div v-if="product.promo_price" class="flex flex-col gap-0.5">
                  <span
                    class="text-slate-500 text-[11px] line-through leading-none"
                  >
                    R$ {{ formatPrice(product.price) }}
                  </span>
                  <div class="flex items-baseline gap-2">
                    <span
                      class="text-slate-100 font-black text-2xl tracking-tight leading-none"
                    >
                      R$
                      <span class="text-2xl font-black">{{
                        formatPrice(product.promo_price).split(",")[0]
                      }}</span
                      >,{{ formatPrice(product.promo_price).split(",")[1] }}
                    </span>
                    <span
                      class="text-red-500 text-[11px] font-black uppercase tracking-wider"
                    >
                      {{
                        getDiscountPercentage(
                          product.price,
                          product.promo_price,
                        )
                      }}% OFF
                    </span>
                  </div>
                </div>

                <!-- Normal Pricing -->
                <div v-else class="flex flex-col gap-1">
                  <span
                    class="text-slate-100 font-black text-2xl tracking-tight leading-none"
                  >
                    R$
                    <span class="text-2xl font-black">{{
                      formatPrice(product.price).split(",")[0]
                    }}</span
                    >,{{ formatPrice(product.price).split(",")[1] }}
                  </span>
                </div>

                <!-- Mercado Livre Installment Plan -->
                <div class="text-[11px] text-slate-400 mt-1 leading-normal">
                  em
                  <span class="font-bold text-rose-400/90"
                    >{{
                      getInstallmentsCount(
                        product.promo_price || product.price,
                      )
                    }}x R$
                    {{
                      formatPrice(
                        (product.promo_price || product.price) /
                          getInstallmentsCount(
                            product.promo_price || product.price,
                          ),
                      )
                    }}</span
                  >
                  sem juros
                </div>
              </div>

              <!-- Premium Highlighted Solid Purchase Button -->
              <button
                class="btn bg-slate-600 w-full rounded-md text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.01] active:scale-95 group/btn"
              >
                Comprar Agora
                <Icon
                  name="lucide:arrow-right"
                  class="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Pagination Section -->
      <div
        class="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8"
      >
        <p class="text-xs sm:text-sm text-slate-400">
          Mostrando
          <span class="text-white font-bold">{{
            (shopProductSearch.params.page - 1) * 12 + 1
          }}</span>
          a
          <span class="text-white font-bold">{{
            Math.min(
              shopProductSearch.params.page * 12,
              shopProductSearch.response?.pagination?.results || 0,
            )
          }}</span>
          de
          <span class="text-white font-bold">{{
            shopProductSearch.response?.pagination?.results || 0
          }}</span>
          ofertas incríveis.
        </p>

        <div class="flex items-center gap-3">
          <button
            @click="shopProductSearch.pageGoto('-')"
            :disabled="shopProductSearch.params.page === 1"
            class="px-4 py-2.5 text-xs font-black rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 hover:text-white hover:border-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md disabled:hover:border-white/10"
          >
            Anterior
          </button>

          <span class="text-xs text-slate-400 font-bold px-2">
            Página {{ shopProductSearch.params.page }} de
            {{ shopProductSearch.response?.pagination?.pages || 1 }}
          </span>

          <button
            @click="shopProductSearch.pageGoto('+')"
            :disabled="
              shopProductSearch.params.page >=
              (shopProductSearch.response?.pagination?.pages || 0)
            "
            class="px-4 py-2.5 text-xs font-black rounded-xl border border-white/10 bg-slate-900/60 text-slate-300 hover:text-white hover:border-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md disabled:hover:border-white/10"
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

// Helpers para simular estrutura rica de dados no estilo Mercado Livre de forma determinística
const getProductBrand = (product) => {
  const name = product.name.toLowerCase();
  if (name.includes("motorola")) return "Motorola";
  if (name.includes("samsung")) return "Samsung";
  if (name.includes("apple") || name.includes("iphone")) return "Apple";
  if (name.includes("xiaomi")) return "Xiaomi";
  if (name.includes("anker")) return "Anker";
  if (name.includes("jbl")) return "JBL";
  if (name.includes("lg")) return "LG";
  if (name.includes("tcl")) return "TCL";
  if (name.includes("lenovo")) return "Lenovo";
  if (name.includes("asus")) return "ASUS";
  if (name.includes("sony") || name.includes("playstation")) return "Sony";
  if (name.includes("microsoft") || name.includes("xbox")) return "Microsoft";
  if (name.includes("ea sports") || name.includes("electronic arts"))
    return "EA Sports";
  if (name.includes("multilaser")) return "Multilaser";
  if (
    name.includes("barbie") ||
    name.includes("hot wheels") ||
    name.includes("mattel")
  )
    return "Mattel";
  if (name.includes("estrela")) return "Estrela";
  if (name.includes("lego")) return "LEGO";
  if (name.includes("luccas neto") || name.includes("baby brink"))
    return "Baby Brink";
  if (name.includes("disney") || name.includes("mickey")) return "Disney";
  if (name.includes("toyster")) return "Toyster";
  if (name.includes("buddemeyer")) return "Buddemeyer";
  if (name.includes("altenburg")) return "Altenburg";
  if (name.includes("lupo")) return "Lupo";
  if (name.includes("hering")) return "Hering";
  if (name.includes("havaianas")) return "Havaianas";
  if (
    name.includes("nestle") ||
    name.includes("nescau") ||
    name.includes("nescafe")
  )
    return "Nestlé";
  if (name.includes("lacta")) return "Lacta";
  if (name.includes("fini")) return "Fini";
  if (name.includes("doritos") || name.includes("elma chips"))
    return "Elma Chips";
  if (name.includes("coca-cola")) return "Coca-Cola";
  if (name.includes("heineken")) return "Heineken";
  if (name.includes("mondial")) return "Mondial";
  if (name.includes("consul")) return "Consul";
  if (name.includes("electrolux")) return "Electrolux";
  if (name.includes("taiff")) return "Taiff";
  if (name.includes("boticário") || name.includes("malbec"))
    return "O Boticário";
  if (name.includes("cerave")) return "CeraVe";
  if (name.includes("nivea")) return "Nivea";
  if (name.includes("loreal") || name.includes("elseve")) return "L'Oréal";
  if (name.includes("dove")) return "Dove";
  if (name.includes("oxford")) return "Oxford";
  if (name.includes("tramontina")) return "Tramontina";
  if (name.includes("invicta")) return "Invicta";
  if (name.includes("sanremo")) return "Sanremo";
  if (name.includes("tilibra")) return "Tilibra";
  if (name.includes("stabilo")) return "Stabilo";
  if (name.includes("bic")) return "Bic";
  if (name.includes("chamex")) return "Chamex";
  return "Importado";
};

const getInstallmentsCount = (price) => {
  if (price >= 500) return 10;
  if (price >= 100) return 6;
  return 3;
};

const getProductSales = (product) => {
  const id = product.id || 1;
  return ((id * 23) % 4500) + 45;
};

// Sugestões de Busca rápidas (palavras-chave do acervo)
const suggestions = [
  "Airfryer",
  "Smartphone",
  "Barbie",
  "Lego",
  "Coca-cola",
  "Heineken",
  "Chocolate",
];

// Categoria selecionada ativamente
const currentCategory = ref(route.query.search || "");

// Mapeamento de abas de categorias com ícones lindos do Lucide
const categories = [
  { name: "Tudo", query: "", icon: "lucide:layout-grid" },
  { name: "Roupas", query: "jeans,tshirt,socks,pajamas", icon: "lucide:shirt" },
  { name: "Brinquedos", query: "toy,lego,barbie", icon: "lucide:baby" },
  {
    name: "Cama & Mesa",
    query: "bed,towel,pillow,sheet",
    icon: "lucide:bed-double",
  },
  {
    name: "Eletrônicos",
    query: "phone,tv,console,headphone",
    icon: "lucide:tv",
  },
  {
    name: "Bomboniere",
    query: "chocolate,candy,cocacola,beer",
    icon: "lucide:candy",
  },
];

// Helper para formatar moeda brasileira
const formatPrice = (price) => {
  if (price === undefined || price === null) return "0,00";
  return parseFloat(price).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Cálculo do percentual de desconto
const getDiscountPercentage = (price, promoPrice) => {
  if (!price || !promoPrice) return 0;
  return Math.round((1 - promoPrice / price) * 100);
};

// Ação rápida ao clicar em tags ou categorias
const setSearch = (value) => {
  shopProductSearch.params.search = value;
  shopProductSearch.params.page = 1;
  currentCategory.value = "";
  shopProductSearch.run();
};

// Seleciona a aba e limpa a busca livre para ficar limpo
const setCategory = (value) => {
  currentCategory.value = value;
  shopProductSearch.params.search = value;
  shopProductSearch.params.page = 1;
  shopProductSearch.run();
};

// Limpar todos os filtros simultaneamente
const clearFilters = () => {
  shopProductSearch.params.search = "";
  shopProductSearch.params.page = 1;
  currentCategory.value = "";
  shopProductSearch.run();
};

const shopProductSearch = useAxios(
  {
    method: "get",
    url: "/api/shop_product",
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
        shopProductSearch.params.page =
          Number(shopProductSearch.params.page) + 1;
      } else if (page == "-") {
        shopProductSearch.params.page =
          Number(shopProductSearch.params.page) - 1;
      }
      shopProductSearch.run();
    },
    async run() {
      const resp = await shopProductSearch.submit();
      // Atualiza aba ativa se vier da URL
      if (resp.data.params?.search) {
        currentCategory.value = resp.data.params.search;
      }
      const query = Object.fromEntries(
        Object.entries(resp.data.params).filter((v) => !!v[1]),
      );
      navigateTo({ query });
    },
  },
);

shopProductSearch.run();
</script>

<style scoped>
/* Efeito de brilho de foco suave */
.input:focus {
  box-shadow: 0 0 25px rgba(220, 38, 38, 0.15);
}
</style>
