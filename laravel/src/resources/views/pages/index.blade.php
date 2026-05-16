@extends('layouts.main')

@section('content')
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="max-w-3xl w-full text-center space-y-8">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-pulse">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Ambiente de Teste Ativo
            </div>

            <!-- Hero Text -->
            <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight">
                <span class="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Olá, bem-vindo ao</span>
                <br>
                <span class="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">seu novo Laravel.</span>
            </h1>

            <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Este é o ponto de partida para sua próxima grande ideia. 
                Tudo pronto para você começar a construir algo incrível com 
                <span class="text-slate-100 font-semibold">Tailwind v4</span> e <span class="text-slate-100 font-semibold">PHP 8.4</span>.
            </p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a href="#" class="group relative px-8 py-3 rounded-xl bg-blue-600 font-bold text-white transition-all hover:bg-blue-500 hover:scale-105 active:scale-95">
                    Começar Projeto
                    <div class="absolute inset-0 rounded-xl bg-blue-400 blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </a>
                <a href="{{ url('/docs/start') }}" class="px-8 py-3 rounded-xl bg-slate-800 border border-slate-700 font-bold text-slate-200 transition-all hover:bg-slate-700">
                    Ver Documentação
                </a>
            </div>

            <!-- Stats/Features -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 border-t border-slate-800/50">
                <div class="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <div class="text-2xl font-bold text-white">Rápido</div>
                    <div class="text-sm text-slate-500">Powered by FrankenPHP</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <div class="text-2xl font-bold text-white">Moderno</div>
                    <div class="text-sm text-slate-500">Tailwind CSS v4</div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <div class="text-2xl font-bold text-white">Docker</div>
                    <div class="text-sm text-slate-500">Pronto para Dev</div>
                </div>
            </div>
        </div>
    </div>
@endsection