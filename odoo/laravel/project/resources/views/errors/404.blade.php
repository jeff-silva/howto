@extends('app')

@section('body')
<div class="py-12 text-center">
  <span class="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full mb-3">
    Erro 404
  </span>
  <h1 class="text-3xl font-bold text-slate-800">Página ou subdomínio não encontrado</h1>
  <p class="mt-2 text-slate-500 text-sm max-w-md mx-auto">
    O endereço solicitado não existe ou não foi configurado. Verifique a URL e tente novamente.
  </p>
  <div class="mt-6">
    <a href="http://localhost/" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition">
      Voltar para o início
    </a>
  </div>
</div>
@endsection
