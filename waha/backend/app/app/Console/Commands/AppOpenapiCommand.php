<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AppOpenapiCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:openapi';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cria rotas e arquivo openapi.json';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $controllers = $this->getControllers();
        $this->writeRoutesApiFile($controllers);
        $this->writeSwaggerHtml($controllers);
    }

    public function writeRoutesApiFile($controllers)
    {
        $content = ['<?php', ''];
        $content[] = 'use Illuminate\Http\Request;';
        $content[] = 'use Illuminate\Support\Facades\Route;';
        $content[] = '';

        foreach ($controllers as $controller) {
            $instance = $controller->instance;
            $content[] = "Route::{$instance->method}('{$instance->route}', {$controller->class}::class);";
        }

        file_put_contents(base_path('routes/api.php'), join("\n", $content));

        // <?php

        // use Illuminate\Http\Request;
        // use Illuminate\Support\Facades\Route;

        // Route::get('/user', function (Request $request) {
        //     return $request->user();
        // })->middleware('auth:sanctum');

    }

    public function getOpenapiData($controllers)
    {
        $openapi = [
            'openapi' => '3.0.0',
            'info' => [
                'version' => '1.0.0',
                'title' => 'app',
                'license' => [
                    'name' => 'MIT',
                ],
            ],
            'servers' => [
                ['url' => 'http://localhost:8000/api'],
                // ['url' => url('/api/v1')],
                // ['url' => url('/api/v1-hml')],
            ],
            'paths' => [],
            'components' => [
                'schemas' => [],
            ],
        ];

        foreach ($controllers as $controller) {
            $instance = $controller->instance;

            $route = array_merge([
                'summary' => '',
                'operationId' => '',
                'tags' => [],
                'parameters' => [],
                'responses' => [
                    '200' => [
                        'description' => 'Success',
                        'content' => [
                            'application/json' => new \stdClass,
                        ],
                    ],
                ],
            ], $instance->openapi());

            $instance->route = '/' . trim($instance->route, '/');

            if (!isset($openapi['paths'][$instance->route])) {
                $openapi['paths'][$instance->route] = [];
            }

            if (!isset($openapi['paths'][$instance->route][$instance->method])) {
                $openapi['paths'][$instance->route][$instance->method] = $route;
            }
        }

        return $openapi;
    }

    public function writeSwaggerHtml($controllers)
    {
        $openapi = $this->getOpenapiData($controllers);
        $openapi_json = json_encode($openapi);

        $content = <<<EOF
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>{$openapi['info']['title']} | Swagger UI</title>
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css">
            <link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/favicon-32x32.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/favicon-16x16.png" sizes="16x16" />
            <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>

        <body>
            <div id="swagger-ui"></div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js"></script>
            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    window.ui = SwaggerUIBundle({
                        dom_id: '#swagger-ui',
                        deepLinking: true,
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIStandalonePreset
                        ],
                        plugins: [
                            SwaggerUIBundle.plugins.DownloadUrl
                        ],
                        layout: "StandaloneLayout",
                        spec: {$openapi_json},
                    });
                });
            </script>
        </body>

        </html>
        EOF;

        file_put_contents(public_path('swagger.html'), $content);
    }

    public function getControllers()
    {
        $files = glob(app_path('/Http/Controllers/*.php'));

        $files = array_map(function ($file) {
            if (in_array($file, [app_path('/Http/Controllers/Controller.php')])) {
                return null;
            }

            $item = new \stdClass;
            $item->file = $file;
            $item->namespace = null;

            $item->class = 'App/' . str_replace(app_path(), '', $file);
            $item->class = str_replace('.php', '', $item->class);
            $item->class = preg_split('/[^a-zA-Z0-9]/', $item->class);
            $item->class = array_filter($item->class, fn($value) => !!$value);
            $item->class = join('\\', $item->class);

            $item->instance = app($item->class);

            $reflection = new \ReflectionClass($item->instance);
            $item->namespace = $reflection->getNamespaceName();

            return $item;
        }, $files);

        return array_values(array_filter($files));
    }
}
