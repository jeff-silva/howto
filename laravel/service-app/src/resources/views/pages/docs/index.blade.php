@extends('layouts/docs')

@section('content')
<div class="space-y-8">
    <!-- Hero / Intro -->
    <div class="relative pb-6 border-b border-slate-900/60">
        <h1 class="font-display text-4xl font-extrabold text-white tracking-tight mb-3">
            Visão Geral da API
        </h1>
        <p class="text-base text-slate-400 leading-relaxed max-w-3xl">
            Bem-vindo à documentação oficial da API do <strong class="text-white font-medium">MovieDB Service</strong>. Esta API fornece acesso de alto desempenho para consulta de filmes, gerenciamento de listas de reprodução, cache inteligente sincronizado com o TMDB, autenticação segura baseada em JWT e persistência robusta de favoritos.
        </p>
    </div>

    <!-- Info Alert Box -->
    <div class="flex gap-4 p-4 bg-brand-500/5 border border-brand-500/20 rounded-sm text-sm text-brand-300 leading-relaxed">
        <div class="shrink-0 pt-0.5">
            <svg class="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <div>
            <strong class="font-semibold text-brand-200">Dica de Produção:</strong> Todas as solicitações de API devem ser feitas por meio de conexões HTTPS seguras e devem conter o cabeçalho <code class="bg-brand-500/10 px-1 py-0.5 rounded-sm text-xs font-mono text-brand-200">Authorization: Bearer &lt;token&gt;</code> para rotas autenticadas.
        </div>
    </div>

    <!-- Core Sections -->
    <div class="space-y-4">
        <h2 class="font-display text-2xl font-bold text-white tracking-tight">Arquitetura de Endpoints</h2>
        <p class="text-slate-400 text-sm leading-relaxed">
            A API é estruturada sob padrões RESTful e retorna respostas codificadas exclusivamente em formato JSON. Veja abaixo a lista simplificada dos principais recursos:
        </p>
    </div>

    <!-- Endpoint Showcase Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Card 1 -->
        <div class="group p-5 bg-slate-900/30 border border-slate-900 hover:border-brand-500/30 rounded-sm transition-all duration-300">
            <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-sm font-mono">GET</span>
                <span class="text-[10px] text-slate-500 font-mono">/api/movies</span>
            </div>
            <h3 class="text-sm font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">Listar Filmes</h3>
            <p class="text-xs text-slate-400 leading-relaxed">Retorna uma lista paginada de filmes com suporte a filtros de gênero, ano e ordenação avançada por relevância.</p>
        </div>

        <!-- Card 2 -->
        <div class="group p-5 bg-slate-900/30 border border-slate-900 hover:border-brand-500/30 rounded-sm transition-all duration-300">
            <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm font-mono">POST</span>
                <span class="text-[10px] text-slate-500 font-mono">/api/auth/login</span>
            </div>
            <h3 class="text-sm font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">Autenticação JWT</h3>
            <p class="text-xs text-slate-400 leading-relaxed">Gera tokens de acesso válidos a partir de credenciais de usuário cadastradas para consumo seguro da API.</p>
        </div>
    </div>

    <!-- Code Block Example -->
    <div class="space-y-4">
        <h2 class="font-display text-2xl font-bold text-white tracking-tight">Exemplo de Requisição</h2>
        <p class="text-slate-400 text-sm leading-relaxed">
            Consulte filmes facilmente utilizando comandos `cURL` ou qualquer biblioteca HTTP de sua preferência. Veja um exemplo prático de consulta abaixo:
        </p>

        <!-- Premium code-block wrapper with mockup header -->
        <div class="border border-slate-900 rounded-sm overflow-hidden bg-slate-950 shadow-2xl">
            <div class="bg-slate-900/50 px-4 py-2 border-b border-slate-900 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500/60 block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500/60 block"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500/60 block"></span>
                    <span class="text-[10px] font-mono text-slate-500 ml-2">terminal — fetch-movies.sh</span>
                </div>
                <button class="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    Copy
                </button>
            </div>
            <pre class="p-4 text-xs font-mono text-brand-300 overflow-x-auto leading-relaxed"><code>curl -X GET "https://api.moviedb.service/v1/movies?genre=action&limit=5" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer your_jwt_secret_token_here"</code></pre>
        </div>
    </div>

    <!-- Next Steps Navigation Link -->
    <div class="p-5 border border-slate-900 bg-slate-900/10 rounded-sm flex items-center justify-between gap-4 mt-8">
        <div>
            <span class="text-[10px] font-mono text-brand-400 uppercase font-semibold">Próximo Passo</span>
            <h4 class="text-base font-bold text-white mt-0.5">Configuração Rápida & Instalação</h4>
        </div>
        <a href="#" class="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-sm transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        </a>
    </div>
</div>
@endsection