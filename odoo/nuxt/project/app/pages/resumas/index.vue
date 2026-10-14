<script setup lang="ts">
import type { Resume } from '~~/server/database/schema'

definePageMeta({
  layout: 'app',
})

// Consulta dados no SSR via endpoint Nitro alimentado pelo Drizzle ORM
const { data: resumes, error } = await useFetch<Resume[]>('/api/resumas_resume')

const formatJson = (data: any) => {
  if (!data) return ''
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data
    return JSON.stringify(parsed, null, 2)
  } catch {
    return String(data)
  }
}

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-zinc-800/80 pb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">Currículos</h1>
        <p class="text-xs text-zinc-400 mt-1">
          Consultando tabela <code class="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-indigo-400 text-[11px]">resumas_resume</code> via Drizzle ORM (<span class="font-semibold text-zinc-200">{{ resumes?.length ?? 0 }}</span> registro(s) encontrado(s)).
        </p>
      </div>
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shadow-[0_0_8px_rgba(52,211,153,0.15)]">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Drizzle PostgreSQL
      </span>
    </div>

    <!-- Alerta de Erro se houver -->
    <div v-if="error" class="p-4 rounded-md bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-mono">
      Erro ao consultar banco do Odoo: {{ error.message }}
    </div>

    <!-- Estado vazio -->
    <div v-else-if="!resumes || resumes.length === 0" class="p-8 text-center border border-dashed border-zinc-800 rounded-md bg-zinc-950/40">
      <p class="text-sm text-zinc-500">Nenhum currículo encontrado na tabela <code>resumas_resume</code>.</p>
    </div>

    <!-- Tabela DaisyUI / Tailwind Dark -->
    <div v-else class="overflow-x-auto rounded-md border border-zinc-800/80 bg-zinc-950/40">
      <table class="table w-full text-left text-xs">
        <thead class="bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80">
          <tr>
            <th class="py-3 px-4 font-mono font-semibold">ID</th>
            <th class="py-3 px-4 font-semibold">Título</th>
            <th class="py-3 px-4 font-semibold">Idioma</th>
            <th class="py-3 px-4 font-semibold">Status</th>
            <th class="py-3 px-4 font-semibold">Criado em</th>
            <th class="py-3 px-4 font-semibold">JSON Resume</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800/60 text-zinc-300">
          <tr v-for="resume in resumes" :key="resume.id" class="hover:bg-zinc-900/50 transition-colors">
            <td class="py-3 px-4 font-mono font-medium text-zinc-200">
              #{{ resume.id }}
            </td>
            <td class="py-3 px-4 font-medium text-white">
              {{ resume.name }}
            </td>
            <td class="py-3 px-4">
              <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                {{ resume.language || 'N/A' }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span
                class="badge badge-sm font-mono text-[11px] border"
                :class="{
                  'badge-success bg-emerald-950/80 text-emerald-300 border-emerald-800/80': resume.state === 'active',
                  'badge-warning bg-amber-950/80 text-amber-300 border-amber-800/80': resume.state === 'draft',
                  'badge-neutral bg-zinc-800 text-zinc-400 border-zinc-700': resume.state === 'archived',
                }"
              >
                {{ resume.state || 'N/A' }}
              </span>
            </td>
            <td class="py-3 px-4 font-mono text-zinc-400">
              {{ formatDate(resume.createDate) }}
            </td>
            <td class="py-3 px-4">
              <details v-if="resume.jsonResume" class="group cursor-pointer">
                <summary class="text-indigo-400 hover:text-indigo-300 font-medium select-none list-none text-[11px] inline-flex items-center gap-1">
                  <span>Ver JSON</span>
                  <span class="text-[9px] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <pre class="mt-2 p-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] rounded-md overflow-x-auto max-w-md max-h-48 font-mono leading-relaxed">{{ formatJson(resume.jsonResume) }}</pre>
              </details>
              <span v-else class="text-zinc-600 italic text-[11px]">Vazio</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
