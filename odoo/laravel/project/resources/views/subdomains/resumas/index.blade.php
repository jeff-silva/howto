<?php

use Illuminate\Support\Facades\DB;

$resumes = DB::select('SELECT * FROM resumas_resume ORDER BY id ASC');

?>
@extends('app')

@section('body')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">Currículos</h1>
            <p class="text-sm text-slate-500 mt-1">
                Currículos cadastrados.
            </p>
        </div>
        <!-- <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            Conexão Odoo DB Ativa
        </span> -->
    </div>

    <!-- Tabela -->
    @if(empty($resumes))
        <div class="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p class="text-slate-500">Nenhum currículo encontrado na tabela <code>resumas_resume</code>.</p>
        </div>
    @else
        <div class="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                        <th class="px-4 py-3 font-semibold">ID</th>
                        <th class="px-4 py-3 font-semibold">Título (name)</th>
                        <th class="px-4 py-3 font-semibold">Idioma</th>
                        <th class="px-4 py-3 font-semibold">Status</th>
                        <th class="px-4 py-3 font-semibold">Criado em</th>
                        <th class="px-4 py-3 font-semibold">JSON Resume</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                    @foreach($resumes as $resume)
                        <tr class="hover:bg-slate-50/80 transition-colors">
                            <td class="px-4 py-3 font-mono font-medium text-slate-900">
                                #{{ $resume->id }}
                            </td>
                            <td class="px-4 py-3 font-medium text-slate-900">
                                {{ $resume->name }}
                            </td>
                            <td class="px-4 py-3 text-slate-600">
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                    {{ $resume->language ?? 'N/A' }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                @php
                                    $stateClasses = match($resume->state) {
                                        'active' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                        'draft' => 'bg-amber-50 text-amber-700 border-amber-200',
                                        'archived' => 'bg-slate-100 text-slate-600 border-slate-200',
                                        default => 'bg-slate-50 text-slate-700 border-slate-200'
                                    };
                                @endphp
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {{ $stateClasses }}">
                                    {{ $resume->state ?? 'N/A' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-xs text-slate-500 font-mono">
                                {{ $resume->create_date ?? '-' }}
                            </td>
                            <td class="px-4 py-3">
                                @if(!empty($resume->json_resume))
                                    <details class="group cursor-pointer">
                                        <summary class="text-xs text-indigo-600 hover:text-indigo-800 font-medium select-none">
                                            Ver JSON
                                        </summary>
                                        <pre class="mt-2 p-3 bg-slate-900 text-slate-100 text-xs rounded-lg overflow-x-auto max-w-lg max-h-48 font-mono">{{ is_string($resume->json_resume) ? json_encode(json_decode($resume->json_resume), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) : json_encode($resume->json_resume, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                                    </details>
                                @else
                                    <span class="text-xs text-slate-400 italic">Vazio</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>
@endsection