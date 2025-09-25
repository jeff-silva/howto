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
            $item->id = $reflection->getShortName();

            return $item;
        }, $files);

        return array_values(array_filter($files));
    }

    public function writeRoutesApiFile($controllers)
    {
        $content = ['<?php', ''];
        $content[] = 'use Illuminate\Http\Request;';
        $content[] = 'use Illuminate\Support\Facades\Route;';
        $content[] = '';

        foreach ($controllers as $controller) {
            $instance = $controller->instance;
            $content[] = "Route::{$instance->method}('{$instance->route}', {$controller->class}::class)->name('{$controller->id}');";
        }

        $content[] = '';

        file_put_contents(base_path('routes/api.php'), join("\n", $content));

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
                'operationId' => "{$controller->id}",
                'summary' => '',
                'description' => '',
                'tags' => [],
                'parameters' => [],
                'responses' => [
                    '200' => [
                        'description' => 'Success',
                        'content' => [
                            'application/json' => new \stdClass,
                        ],
                    ],
                    '400' => [
                        'description' => 'Invalid',
                        'content' => [
                            'application/json' => new \stdClass,
                        ],
                    ],
                ],
            ], $instance->openapi());

            $requestBody = [];
            foreach ($instance->openapiParams() as $param) {
                $param = array_merge([
                    'name' => '',
                    'in' => 'query',
                    'description' => '',
                    'required' => false,
                    'format' => '',
                    'example' => '',
                    'schema' => ['type' => 'string'],
                ], $param);

                if ($param['in'] == 'body') {
                    $param_name = $param['name'];
                    $param['type'] = $param['schema']['type'];
                    unset($param['in'], $param['schema'], $param['name']);
                    $requestBody[$param_name] = $param;
                    continue;
                }

                $route['parameters'][] = $param;
            }

            if (! empty($requestBody)) {
                $route['requestBody'] = [
                    'description' => '',
                    'required' => true,
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => $requestBody,
                            ],
                        ],
                    ],
                ];
            }

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
        $openapi_json = json_encode($openapi, JSON_PRETTY_PRINT);
        $openapi_json = str_replace("\n", "\n                ", $openapi_json);

        $content = <<<EOF
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>{$openapi['info']['title']} | Swagger UI</title>
            <link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/favicon-32x32.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/favicon-16x16.png" sizes="16x16" />
            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-themes@1.4.3/themes/dark.min.css">
            <style>html, body { margin: 0; padding: 0; }</style>
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
}
