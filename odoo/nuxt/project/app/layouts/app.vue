<script setup lang="ts">
const isResumas = ref(false)

if (import.meta.server) {
  const url = useRequestURL()
  isResumas.value = url.hostname.startsWith('resumas.')
} else {
  isResumas.value = window.location.hostname.startsWith('resumas.')
}
</script>

<template>
  <div data-theme="dark" class="bg-[#090a0f] text-zinc-100 antialiased p-4 sm:p-6 min-h-screen relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
    <!-- Luz ambiente suave de fundo (sutil toque neon) -->
    <div class="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(99,102,241,0.14),rgba(0,0,0,0))]"></div>
    <div class="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_50%_30%_at_80%_90%,rgba(16,185,129,0.06),rgba(0,0,0,0))]"></div>

    <div class="relative z-10 max-w-5xl mx-auto">
      <!-- Barra de Navegação estilo Glass com bordas pouco arredondadas (rounded-md) -->
      <nav class="mb-6 backdrop-blur-md bg-zinc-900/60 border border-zinc-800/80 rounded-md px-3.5 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Logo / Brand Tag com sutil neon -->
          <div class="flex items-center gap-2 pr-3 border-r border-zinc-800/80">
            <span class="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.9)]"></span>
            <span class="font-mono text-xs font-semibold tracking-wider text-zinc-300 uppercase">Stack</span>
          </div>

          <!-- Links de navegação -->
          <ul class="flex items-center gap-1.5 text-xs font-medium">
            <li>
              <a
                href="http://localhost:3000/"
                class="px-3 py-1.5 rounded-md transition-all duration-150 inline-flex items-center gap-1.5"
                :class="!isResumas 
                  ? 'bg-zinc-800/90 text-white border border-zinc-700/80 shadow-[0_0_12px_-2px_rgba(99,102,241,0.3)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'"
              >
                Início
              </a>
            </li>
            <li>
              <a
                href="http://resumas.localhost:3000/"
                class="px-3 py-1.5 rounded-md transition-all duration-150 inline-flex items-center gap-1.5"
                :class="isResumas 
                  ? 'bg-zinc-800/90 text-white border border-emerald-500/40 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'"
              >
                Resumas
              </a>
            </li>
          </ul>
        </div>

        <!-- Status do Host Atual -->
        <div class="flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono rounded-md bg-zinc-950/60 border border-zinc-800/70 text-zinc-400">
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="isResumas 
              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' 
              : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]'"
          ></span>
          <span>{{ isResumas ? 'resumas.localhost' : 'localhost' }}</span>
        </div>
      </nav>

      <!-- Conteúdo Principal com sutil glow no topo e vidro fosco dark -->
      <main class="backdrop-blur-md bg-zinc-900/50 border border-zinc-800/80 rounded-md p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.45)] relative overflow-hidden">
        <!-- Linha sutil de realce neon superior -->
        <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>

        <slot />
      </main>
    </div>
  </div>
</template>
