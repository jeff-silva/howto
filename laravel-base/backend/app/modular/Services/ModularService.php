<?php

namespace Modular\Services;

use Illuminate\Support\Facades\Route;

class ModularService
{
  public $openapi = [
    'openapi' => '3.0.0',
    'info' => [
      'title' => 'API',
      'version' => '1.0.0',
    ],
    'paths' => [],
    'components' => [
      'schemas' => [],
    ],
  ];

  public function route(
    $path = '/',
    $methods = ['get'],
    $name = null,
    $call = [],
    $middleware = [],
    $params = []
  ) {
    foreach ($params as $paramName => $paramData) {
      $params[$paramName] = array_merge([
        'in' => 'query', // query, path, body, header
        'default' => '',
        'example' => '',
        'description' => '',
        'required' => false,
        'type' => 'string',
      ], $paramData);
    }

    if (!isset($this->openapi['paths'][$path])) {
      $this->openapi['paths'][$path] = [];
    }

    foreach ($methods as $method) {
      $item = [
        'operationId' => $name,
        'parameters' => [],
        'responses' => [
          200 => ['description' => 'OK'],
          400 => ['description' => 'Bad Request'],
          401 => ['description' => 'Unauthorized'],
        ],
      ];

      $schema = [
        'type' => 'object',
        'properties' => [],
      ];
      foreach ($params as $paramName => $paramData) {
        if ($paramData['in'] != 'body') continue;
        $schema['properties'][$paramName] = [
          'type' => $paramData['type'],
        ];
      }

      if (!empty($schema['properties'])) {
        $this->openapi['components']['schemas'][$name] = $schema;
      }

      foreach ($params as $paramName => $paramData) {
        if ($paramData['in'] == 'body') {
          $item['requestBody'] = [
            'required' => true,
            'content' => [
              'application/json' => [
                'schema' => [
                  '$ref' => "#/components/schemas/{$name}",
                ],
              ],
            ],
          ];
        } else {
          $item['parameters'][] = [
            'name' => $paramName,
            'in' => $paramData['in'],
            'required' => $paramData['required'],
          ];
        }
      }

      $this->openapi['paths'][$path][$method] = $item;
    }

    Route::match($methods, $path, $call)
      ->name($name)
      ->middleware($middleware);
  }

  public function getOpenapi()
  {
    return $this->openapi;
  }

  public function bootRoutes($controllers = [])
  {
    foreach ($controllers as $controller) {
      foreach ((new \ReflectionClass($controller))->getMethods() as $method) {
        if (!$method->isPublic() || $method->isStatic()) continue;
        foreach ($method->getAttributes(\Modular\Attributes\Route::class) as $attr) {
          $args = $attr->getArguments();
          $args['call'] = [$method->class, $method->getName()];
          $this->route(...$args);
        }
      }
    }
  }
}
