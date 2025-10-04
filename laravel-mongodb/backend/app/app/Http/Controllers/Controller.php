<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;

abstract class Controller
{
    public $route = '/';
    public $name = null;
    public $methods = ['get'];
    public $middlewares = [];

    public function __construct()
    {
        if (!$this->name) {
            $this->name = class_basename(get_called_class());
            $this->name = preg_replace('/Controller$/', '', $this->name);
        }
    }

    static function register(array $controllers)
    {
        $openapi = new OpenApi();
        foreach ($controllers as $controller) {
            $c = app($controller);
            Route::match($c->methods, $c->route, $controller)->name($c->name)->middleware($c->middlewares);

            $data = $c->openApiData();
            $data['operationId'] = $c->name;
            $openapi->addPath($c->methods, $c->route, $data);
            $openapi->addPathParams($c->methods, $c->route, $c->openApiParams());

            if ($model = $c->openApiModel()) {
                $openapi->addSchemaFromModel($model);
            }
        }

        Route::match(['get'], '/openapi', function () use ($openapi) {
            return $openapi->getData();
        })->name('openapi');

        Route::match(['get'], '/', function () use ($openapi) {
            $content = ['<!doctype html><head><meta charset="utf-8"><title>Laravel | Swagger UI</title>'];
            $content[] = '<meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">';
            $content[] = '<link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/favicon-32x32.png" sizes="32x32" />';
            $content[] = '<link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/favicon-16x16.png" sizes="16x16" />';
            $content[] = '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css">';
            $content[] = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-themes@1.4.3/themes/dark.min.css">';
            $content[] = '<style>html, body { margin: 0; padding: 0; }</style></head><body><div id="swagger-ui"></div>';
            $content[] = '<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js"></script>';
            $content[] = '<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js"></script>';
            $content[] = '<script>document.addEventListener("DOMContentLoaded", () => {';
            $content[] = 'window.ui = SwaggerUIBundle({';
            $content[] = 'dom_id: "#swagger-ui", deepLinking: true, ';
            $content[] = 'presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],';
            $content[] = 'plugins: [SwaggerUIBundle.plugins.DownloadUrl],';
            $content[] = 'layout: "StandaloneLayout",';
            $content[] = 'spec: ' . json_encode($openapi->getData()) . ',';
            $content[] = '});';
            $content[] = '});';
            $content[] = '</script></body></html>';
            return join('', $content);
        })->name('index');
    }

    public function error($code, $error)
    {
        return response()->json(compact(['code', 'error']), $code);
    }

    public function openApiData()
    {
        return [];
    }

    public function openApiModel()
    {
        return null;
    }

    public function openApiParams()
    {
        return [];
    }
}

class OpenApi
{
    public $data = [];

    public function __construct()
    {
        $this->data = [
            'openapi' => '3.0.4',
            'info' => [
                'version' => '1.0.0',
                'title' => '',
                'description' => '',
                'termsOfService' => '',
                'contact' => [
                    'email' => '',
                ],
                'license' => [
                    'name' => '',
                    'url' => '',
                ],
            ],
            'externalDocs' => [
                'description' => '',
                'url' => '',
            ],
            'servers' => [
                ['url' => 'http://localhost:8000/api'],
            ],
            'tags' => [],
            'paths' => [],
            'components' => [
                'schemas' => [],
                'requestBodies' => [],
                'securitySchemes' => [],
            ],
        ];
    }

    public function getData()
    {
        return $this->data;
    }

    public function addPath($methods, $route, null | array $data = null)
    {
        $route = '/' . ltrim($route, '/');


        if (!isset($this->data['paths'][$route])) {
            $this->data['paths'][$route] = [];
        }

        if (is_array($data)) {
            $data = $this->pathDefault($data);
            foreach ($methods as $method) {
                if (!isset($this->data['paths'][$route][$method])) {
                    $this->data['paths'][$route][$method] = $data;
                }
            }
        }
    }

    public function addPathParams($methods, $route, $params)
    {
        $this->addPath($methods, $route, null);
        foreach ($methods as $method) {
            $parameters = [];
            $requestBody = [];
            foreach ($params as $i => $param) {
                $param = array_merge(['in' => 'query'], $param);

                if ($param['in'] == 'body') {
                    $param_name = $param['name'];
                    unset($param['in'], $param['name']);
                    $requestBody[$param_name] = array_merge([
                        'type' => 'string',
                    ], $param);
                    unset($params[$i]);
                    continue;
                }
            }

            $this->data['paths'][$route][$method]['parameters'] = $params;
            if (!empty($requestBody)) {
                $this->data['paths'][$route][$method]['requestBody'] = [
                    'description' => 'body',
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'required' => [],
                                'properties' => $requestBody,
                            ],
                        ],
                    ],
                ];
            }
        }
    }

    public function addSchemaFromModel($model)
    {
        $model = app($model);
        $table = $model->getTable();

        if (!isset($this->data['components']['schemas'][$table])) {
            $data = [
                'type' => 'object',
                'properties' => [
                    'id' => [
                        'type' => 'integer',
                        'format' => 'int64',
                        'example' => 10,
                    ],
                ],
            ];

            foreach ($model->getFillable() as $name) {
                $data['properties'][$name] = [
                    'type' => 'string',
                ];
            }

            $this->data['components']['schemas'][$table] = $data;
        }
    }

    public function pathDefault($data = [])
    {
        $data = array_merge([
            'summary' => '',
            'description' => '',
            'operationId' => '',
            'tags' => [],
            'parameters' => [],
            // 'requestBody' => [
            //     'description' => 'Update',
            //     'content' => [
            //         'application/json' => [],
            //     ],
            // ],
            'responses' => [

                '200' => [
                    'description' => 'success',
                ],
                '400' => [
                    'description' => 'error-invalid-id',
                ],
                '404' => [
                    'description' => 'error-not-found',
                ],
                '500' => [
                    'description' => 'error-internal',
                ],
                'default' => [
                    'description' => 'error-unexpected',
                ],
            ],
        ], $data);

        return $data;
    }
}
