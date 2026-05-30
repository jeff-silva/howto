<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Documentação — MovieDB Service' }}</title>
    
    <!-- Google Fonts for exquisite visual typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Tailwind v4 CDN -->
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    
    <!-- Custom Theme Configuration for Tailwind v4 -->
    <style type="text/tailwindcss">
        @theme {
            --font-sans: 'Inter', sans-serif;
            --font-display: 'Plus Jakarta Sans', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
            
            /* Curated teal-emerald premium color palette */
            --color-brand-50: #f0fdfa;
            --color-brand-100: #ccfbf1;
            --color-brand-200: #99f6e4;
            --color-brand-300: #5eead4;
            --color-brand-400: #2dd4bf;
            --color-brand-500: #14b8a6;
            --color-brand-600: #0d9488;
            --color-brand-700: #0f766e;
            --color-brand-800: #115e59;
            --color-brand-900: #134e4a;
            
            --color-slate-950: #070a13;
        }

        /* Custom micro-animations and glows */
        @utility animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.25; transform: scale(1); }
            50% { opacity: 0.45; transform: scale(1.05); }
        }
    </style>
    @stack('styles')
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased selection:bg-brand-500/30 selection:text-brand-200 min-h-screen relative overflow-x-hidden">

    <!-- Header Navigation -->
    <header class="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-900/50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            
            <!-- Logo / Brand -->
            <div class="flex items-center gap-3">
                <div class="bg-brand-500/10 border border-brand-500/20 p-1.5 rounded-sm">
                    <svg class="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <div class="flex flex-col">
                    <span class="font-display font-bold tracking-tight text-white flex items-center gap-1.5">
                        MovieDB <span class="text-[10px] font-semibold px-1.5 py-0.5 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-sm">Docs</span>
                    </span>
                    <span class="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Service-App API</span>
                </div>
            </div>

            <!-- Search Bar Mockup -->
            <div class="hidden md:flex items-center flex-1 max-w-md mx-8">
                <div class="relative w-full group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-4 w-4 text-slate-500 group-hover:text-brand-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <input type="text" placeholder="Pesquisar documentação..." class="w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 focus:border-brand-500/50 text-slate-300 placeholder-slate-500 text-sm pl-9 pr-12 py-1.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all">
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <kbd class="text-[10px] font-mono text-slate-500 border border-slate-800 bg-slate-950 px-1.5 py-0.5 rounded-sm">Ctrl K</kbd>
                    </div>
                </div>
            </div>

            <!-- Right Menu / Actions -->
            <div class="flex items-center gap-3">
                <a href="https://github.com" target="_blank" class="text-slate-400 hover:text-white transition-colors p-1.5 rounded-sm border border-transparent hover:border-slate-800 hover:bg-slate-900/40" title="GitHub">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
                    </svg>
                </a>
                <a href="/" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-sm transition-all">
                    <span>Voltar ao App</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                </a>
                
                <!-- Mobile Menu Button -->
                <button id="mobile-menu-btn" class="md:hidden p-1.5 text-slate-400 hover:text-white rounded-sm border border-slate-800 hover:bg-slate-900">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 relative">
        
        <!-- Sidebar Navigation -->
        <aside id="sidebar" class="fixed md:sticky top-24 left-0 z-30 w-64 h-[calc(100vh-8rem)] overflow-y-auto bg-slate-950 md:bg-transparent border-r border-slate-900/50 md:border-0 p-4 md:p-0 transition-transform duration-300 -translate-x-full md:translate-x-0 shrink-0">
            <nav class="space-y-6">
                <!-- Group 1 -->
                <div>
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono mb-3 px-2">Introdução</h3>
                    <ul class="space-y-1">
                        <li>
                            <a href="/docs" class="flex items-center px-3 py-1.5 {{ Request::is('docs') ? 'text-brand-400 bg-brand-500/10 border-l-2 border-brand-500 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800' }} text-sm rounded-r-sm transition-all">
                                Visão Geral
                            </a>
                        </li>
                        <li>
                            <a href="/docs/swagger" class="flex items-center px-3 py-1.5 {{ Request::is('docs/swagger') ? 'text-brand-400 bg-brand-500/10 border-l-2 border-brand-500 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800' }} text-sm rounded-r-sm transition-all">
                                Documentação Swagger
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800 text-sm rounded-r-sm transition-all">
                                Configuração Rápida
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800 text-sm rounded-r-sm transition-all">
                                Arquitetura
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Group 2 -->
                <div>
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono mb-3 px-2">Core API Reference</h3>
                    <ul class="space-y-1">
                        <li>
                            <a href="#" class="flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800 text-sm rounded-r-sm transition-all">
                                <span>Filmes & Séries</span>
                                <span class="text-[9px] font-mono font-semibold px-1 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-sm">GET</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800 text-sm rounded-r-sm transition-all">
                                <span>Autenticação JWT</span>
                                <span class="text-[9px] font-mono font-semibold px-1 py-0.2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm">POST</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800 text-sm rounded-r-sm transition-all">
                                <span>Favoritos</span>
                                <span class="text-[9px] font-mono font-semibold px-1 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-sm">PUT</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center justify-between px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800 text-sm rounded-r-sm transition-all">
                                <span>Usuários</span>
                                <span class="text-[9px] font-mono font-semibold px-1 py-0.2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-sm">DEL</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Group 3 -->
                <div>
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono mb-3 px-2">Serviços & Filas</h3>
                    <ul class="space-y-1">
                        <li>
                            <a href="#" class="flex items-center px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800 text-sm rounded-r-sm transition-all">
                                Sincronização TMDB
                            </a>
                        </li>
                        <li>
                            <a href="#" class="flex items-center px-3 py-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-l-2 border-transparent hover:border-slate-800 text-sm rounded-r-sm transition-all">
                                Cache de Consultas
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0 bg-slate-900/10 border border-slate-900/80 p-6 md:p-8 rounded-sm shadow-xl backdrop-blur-sm">
            <!-- Breadcrumbs -->
            <nav class="flex items-center gap-2 text-xs text-slate-500 mb-6">
                <span class="hover:text-slate-300 transition-colors cursor-pointer">Docs</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span class="text-slate-300 font-medium">Visão Geral</span>
            </nav>

            <!-- Dynamic Laravel Blade Content -->
            <article class="prose prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h3:text-xl prose-p:text-slate-400 prose-p:leading-relaxed prose-a:text-brand-400 hover:prose-a:text-brand-300 prose-code:text-brand-300 prose-code:bg-brand-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-900 prose-pre:p-4 prose-pre:rounded-sm prose-pre:font-mono">
                @yield('content')
            </article>

            <!-- Feedback / Pagination section -->
            <div class="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h4 class="text-sm font-semibold text-white mb-1">Esta página foi útil?</h4>
                    <p class="text-xs text-slate-500">Ajude-nos a melhorar a nossa documentação.</p>
                </div>
                <div class="flex gap-2">
                    <button class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-sm transition-all cursor-pointer">
                        <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                        </svg>
                        Sim
                    </button>
                    <button class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-sm transition-all cursor-pointer">
                        <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10V19a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V3m-7 10h2M17 3h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
                        </svg>
                        Não
                    </button>
                </div>
            </div>
        </main>

        <!-- Right TOC Sidebar (Table of Contents) -->
        <aside class="hidden lg:block w-52 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto shrink-0">
            <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono mb-3">Nesta Página</h4>
            <ul class="space-y-2.5 text-xs text-slate-400">
                <li><a href="#" class="hover:text-brand-400 transition-colors font-medium text-brand-400">Visão Geral</a></li>
                <li><a href="#" class="hover:text-brand-400 transition-colors">Pré-requisitos</a></li>
                <li><a href="#" class="hover:text-brand-400 transition-colors">Conexão de Banco de Dados</a></li>
                <li><a href="#" class="hover:text-brand-400 transition-colors">Configurando as Variáveis</a></li>
                <li><a href="#" class="hover:text-brand-400 transition-colors">Próximos Passos</a></li>
            </ul>
        </aside>
    </div>

    <!-- Simple Interactivity JS for mobile sidebar toggle -->
    <script>
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('-translate-x-full');
            });
            
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && e.target !== mobileBtn) {
                    sidebar.classList.add('-translate-x-full');
                }
            });
        }
    </script>
    @stack('scripts')
</body>
</html>