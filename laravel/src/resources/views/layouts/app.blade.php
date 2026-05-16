<!doctype html>
<html class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
    <body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
    <div class="flex min-h-screen">
        <!-- Sidebar (Navigation) - Agora na Esquerda -->
        <aside class="w-72 border-r border-slate-800 bg-slate-900/30 backdrop-blur-xl hidden xl:flex flex-col sticky top-0 h-screen">
            <div class="p-6 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">L</div>
                    <span class="font-bold tracking-tight">App Name</span>
                </div>
            </div>

            <nav class="flex-1 p-4 space-y-2">
                <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">Menu Principal</div>
                <a href="/" class="flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors text-blue-400 bg-blue-600/10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    Início
                </a>
                <a href="/docs/001" class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-colors text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    Doc 001
                </a>
                <a href="/docs/002" class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-colors text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    Doc 002
                </a>
            </nav>

            <div class="p-4 border-t border-slate-800">
                <div class="bg-slate-800/50 rounded-2xl p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-bold truncate text-white">Jeff Silva</div>
                            <div class="text-xs text-slate-500 truncate">jeff@exemplo.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 relative">
            <!-- Header -->
            <header class="h-16 border-b border-slate-800/50 flex items-center px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
                <div class="text-sm font-medium text-slate-400">Dashboard / <span class="text-slate-100">Visão Geral</span></div>
            </header>

            <div class="max-w-5xl mx-auto p-8">
                @yield('content')
            </div>
        </main>
    </div>
</body>
</html>