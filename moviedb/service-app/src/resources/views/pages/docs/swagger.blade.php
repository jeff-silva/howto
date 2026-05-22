@extends('layouts/docs')

@section('content')
<div class="space-y-6">
    <!-- Header/Tópico -->
    <div class="relative pb-6 border-b border-slate-900/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 class="font-display text-4xl font-extrabold text-white tracking-tight mb-2">
                Referência Swagger
            </h1>
            <p class="text-sm text-slate-400 leading-relaxed max-w-2xl">
                Consulte, explore e realize requisições de teste interativas contra todos os endpoints da API através da nossa console interativa integrada do Swagger UI.
            </p>
        </div>
        
        <!-- Badge indicativo da origem do JSON -->
        <div class="shrink-0 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold rounded-sm">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-400 block animate-pulse"></span>
                Swagger Petstore (CDN JSON)
            </span>
        </div>
    </div>

    <!-- Info Alert Box -->
    <div class="flex gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-sm text-xs text-blue-300 leading-relaxed">
        <div class="shrink-0 pt-0.5">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        </div>
        <div>
            <strong class="font-semibold text-blue-200">Dica de Utilização:</strong> Clique no botão <code class="bg-blue-500/10 px-1 py-0.5 rounded-sm font-mono text-blue-200 font-semibold">Try it out</code> em qualquer um dos endpoints abaixo para liberar o preenchimento de parâmetros e executar requisições em tempo real diretamente da documentação.
        </div>
    </div>

    <!-- Swagger UI Mount Point -->
    <div id="swagger-ui" class="bg-slate-950/20 border border-slate-900 rounded-sm overflow-hidden p-1 md:p-2 shadow-2xl backdrop-blur-xs">
        <div class="flex items-center justify-center py-20 text-slate-400 font-mono text-xs gap-3">
            <svg class="animate-spin h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregando e integrando os esquemas do Swagger...
        </div>
    </div>
</div>
@endsection

@push('styles')
    <!-- Default Swagger UI Stylesheet -->
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    
    <!-- Swagger UI Dark/Muted Theme from CDN -->
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-themes@3.0.1/themes/3.x/theme-muted.css" />

    <!-- Premium custom overrides to blend theme perfectly with our slate/teal palette -->
    <style>
        .swagger-ui {
            font-family: 'Inter', sans-serif !important;
            background-color: transparent !important;
            padding: 10px 0 !important;
        }
        
        /* General text styles */
        .swagger-ui .info, .swagger-ui .scheme-container {
            background-color: transparent !important;
            border-bottom: 1px solid rgba(30, 41, 59, 0.4) !important;
            box-shadow: none !important;
            padding: 16px 0 !important;
            margin: 0 0 20px 0 !important;
        }
        
        .swagger-ui .info .title {
            color: #ffffff !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-weight: 800 !important;
            letter-spacing: -0.025em !important;
        }
        
        .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info table, .swagger-ui .info td, .swagger-ui .info a {
            color: #94a3b8 !important;
            font-size: 13px !important;
            line-height: 1.6 !important;
        }

        .swagger-ui .info a {
            color: var(--color-brand-400) !important;
            text-decoration: underline !important;
        }
        
        .swagger-ui .info a:hover {
            color: var(--color-brand-300) !important;
        }

        /* Endpoints / Operations wrappers */
        .swagger-ui .opblock-tag-section {
            background-color: rgba(15, 23, 42, 0.15) !important;
            border: 1px solid rgba(30, 41, 59, 0.5) !important;
            border-radius: var(--radius-sm) !important;
            margin-bottom: 16px !important;
            padding: 10px !important;
        }

        .swagger-ui .opblock-tag {
            border-bottom: 1px solid rgba(30, 41, 59, 0.5) !important;
            padding: 10px 0 !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-weight: 700 !important;
            color: #ffffff !important;
        }

        .swagger-ui .opblock {
            background-color: rgba(7, 10, 19, 0.6) !important;
            border: 1px solid rgba(30, 41, 59, 0.6) !important;
            border-radius: var(--radius-sm) !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
            transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }

        .swagger-ui .opblock:hover {
            border-color: rgba(20, 184, 166, 0.3) !important;
        }

        /* Operation methods custom tags styling */
        .swagger-ui .opblock .opblock-summary-method {
            border-radius: var(--radius-sm) !important;
            font-family: 'JetBrains Mono', monospace !important;
            font-weight: 700 !important;
            text-shadow: none !important;
            min-width: 70px !important;
            text-align: center !important;
            padding: 4px 8px !important;
        }

        .swagger-ui .opblock .opblock-summary-path {
            color: #e2e8f0 !important;
            font-family: 'JetBrains Mono', monospace !important;
            font-weight: 500 !important;
            font-size: 13px !important;
        }

        .swagger-ui .opblock .opblock-summary-description {
            color: #94a3b8 !important;
            font-size: 12px !important;
        }

        /* Parameter / Try it out tables and parameters UI */
        .swagger-ui .opblock-section-header {
            background-color: rgba(15, 23, 42, 0.3) !important;
            border-bottom: 1px solid rgba(30, 41, 59, 0.6) !important;
            padding: 8px 16px !important;
        }

        .swagger-ui .opblock-section-header h4 {
            color: #f1f5f9 !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        .swagger-ui .parameters-col_name {
            color: #f1f5f9 !important;
            font-family: 'JetBrains Mono', monospace !important;
        }

        .swagger-ui .parameter__name.required:after {
            color: #f43f5e !important;
        }

        .swagger-ui .parameter__type {
            color: var(--color-brand-400) !important;
            font-family: 'JetBrains Mono', monospace !important;
            font-size: 11px !important;
        }

        .swagger-ui .parameter__in {
            color: #64748b !important;
            font-style: italic !important;
            font-size: 11px !important;
        }

        /* Form Controls & Inputs */
        .swagger-ui input[type=text], .swagger-ui select, .swagger-ui textarea {
            background-color: rgba(7, 10, 19, 0.8) !important;
            border: 1px solid rgba(51, 65, 85, 0.8) !important;
            color: #f1f5f9 !important;
            border-radius: var(--radius-sm) !important;
            font-family: 'JetBrains Mono', monospace !important;
            font-size: 12px !important;
            padding: 6px 10px !important;
            transition: border-color 0.15s ease !important;
        }

        .swagger-ui input[type=text]:focus, .swagger-ui select:focus, .swagger-ui textarea:focus {
            border-color: rgba(20, 184, 166, 0.6) !important;
            box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.15) !important;
            outline: none !important;
        }

        /* Buttons custom styling */
        .swagger-ui .btn {
            background-color: rgba(15, 23, 42, 0.8) !important;
            border: 1px solid rgba(51, 65, 85, 0.8) !important;
            color: #e2e8f0 !important;
            border-radius: var(--radius-sm) !important;
            font-weight: 600 !important;
            box-shadow: none !important;
            font-size: 12px !important;
            transition: all 0.15s ease !important;
            cursor: pointer !important;
        }

        .swagger-ui .btn:hover {
            background-color: rgba(30, 41, 59, 0.8) !important;
            border-color: rgba(71, 85, 105, 0.8) !important;
            color: #ffffff !important;
        }

        .swagger-ui .btn.execute {
            background-color: rgba(20, 184, 166, 0.8) !important;
            border-color: rgba(20, 184, 166, 0.9) !important;
            color: #ffffff !important;
        }

        .swagger-ui .btn.execute:hover {
            background-color: rgba(20, 184, 166, 1) !important;
            box-shadow: 0 0 8px rgba(20, 184, 166, 0.4) !important;
        }

        .swagger-ui .btn.cancel {
            background-color: rgba(244, 63, 94, 0.15) !important;
            border-color: rgba(244, 63, 94, 0.3) !important;
            color: #f43f5e !important;
        }

        .swagger-ui .btn.cancel:hover {
            background-color: rgba(244, 63, 94, 0.3) !important;
            color: #ffffff !important;
        }

        /* Responses and Models Section */
        .swagger-ui .responses-table h4, .swagger-ui .responses-table h5 {
            color: #f1f5f9 !important;
        }

        .swagger-ui .response-col_status {
            color: #ffffff !important;
            font-family: 'JetBrains Mono', monospace !important;
            font-weight: 700 !important;
        }

        .swagger-ui .response-col_description__inner div.markdown p {
            color: #94a3b8 !important;
            font-size: 12px !important;
        }

        .swagger-ui pre {
            background-color: #070a13 !important;
            border: 1px solid rgba(30, 41, 59, 0.8) !important;
            border-radius: var(--radius-sm) !important;
            color: var(--color-brand-300) !important;
            font-family: 'JetBrains Mono', monospace !important;
            padding: 12px !important;
        }

        .swagger-ui section.models {
            border: 1px solid rgba(30, 41, 59, 0.6) !important;
            border-radius: var(--radius-sm) !important;
            background-color: rgba(7, 10, 19, 0.4) !important;
            margin-top: 30px !important;
        }

        .swagger-ui section.models h4 {
            border-bottom: 1px solid rgba(30, 41, 59, 0.6) !important;
            color: #ffffff !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
            font-weight: 700 !important;
        }

        .swagger-ui section.models .model-container {
            background-color: transparent !important;
            border-bottom: 1px solid rgba(30, 41, 59, 0.4) !important;
        }

        .swagger-ui .model-title {
            color: #e2e8f0 !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        .swagger-ui .model-box {
            background-color: rgba(7, 10, 19, 0.5) !important;
            border-radius: var(--radius-sm) !important;
            padding: 8px !important;
        }

        .swagger-ui .model {
            color: #94a3b8 !important;
        }

        .swagger-ui .prop-name {
            color: #f1f5f9 !important;
        }

        .swagger-ui .prop-type {
            color: var(--color-brand-400) !important;
        }

        /* Cleanup default header/topbar */
        .swagger-ui .topbar {
            display: none !important;
        }

        /* Modal styling */
        .swagger-ui .dialog-ux .modal-ux {
            background-color: #070a13 !important;
            border: 1px solid rgba(51, 65, 85, 0.8) !important;
            border-radius: var(--radius-sm) !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        .swagger-ui .dialog-ux .modal-ux-header h3 {
            color: white !important;
            font-family: 'Plus Jakarta Sans', sans-serif !important;
        }

        .swagger-ui .dialog-ux .modal-ux-content {
            color: #94a3b8 !important;
        }
    </style>
@endpush

@push('scripts')
    <!-- Swagger UI Dist Bundle CDN JS -->
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js" crossorigin></script>

    <script>
        window.onload = function() {
            // Inicializa a interface do Swagger UI com o schema completo Petstore via CDN
            const ui = SwaggerUIBundle({
                url: "https://petstore.swagger.io/v2/swagger.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "BaseLayout",
                persistAuthorization: true
            });
            window.ui = ui;
        };
    </script>
@endpush
