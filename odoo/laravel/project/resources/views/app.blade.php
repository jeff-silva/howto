<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 antialiased p-6">
  <nav class="mb-6">
    <ul class="flex items-center gap-2 bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 text-sm font-medium">
      <li>
        <a href="http://localhost/" class="px-3 py-1.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition">
          Início
        </a>
      </li>
      <li>
        <a href="http://test.localhost/" class="px-3 py-1.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition">
          Teste
        </a>
      </li>
      <li>
        <a href="http://blau.localhost/" class="px-3 py-1.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition">
          Blau
        </a>
      </li>
      <li>
        <a href="http://resumas.localhost/" class="px-3 py-1.5 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition">
          Resumas
        </a>
      </li>
    </ul>
  </nav>

  <main class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-base">
    @yield('body')
  </main>
</body>
</html>