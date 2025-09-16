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

  public $schema = [];

  public function route($params = [])
  {
    $params = array_merge([
      'path' => '/',
      'methods' => ['get'],
      'name' => null,
      'call' => [],
      'middleware' => [],
      'params' => [],
      'tags' => [],
    ], $params);

    foreach ($params['params'] as $paramName => $paramData) {
      $params['params'][$paramName] = array_merge([
        'in' => 'query', // query, path, body, header
        'default' => '',
        'example' => '',
        'description' => '',
        'required' => false,
        'type' => 'string',
      ], $paramData);
    }

    dump($params);

    // if (!isset($this->openapi['paths'][$path])) {
    //   $this->openapi['paths'][$path] = [];
    // }

    // foreach ($methods as $method) {
    //   $item = [
    //     'operationId' => $name,
    //     'parameters' => [],
    //     'responses' => [
    //       200 => ['description' => 'OK'],
    //       400 => ['description' => 'Bad Request'],
    //       401 => ['description' => 'Unauthorized'],
    //     ],
    //   ];

    //   $item['parameters'] = array_map(function ($params) {
    //     return array_merge([
    //       'in' => 'query',
    //       'type' => 'string',
    //       'default' => null,
    //       'required' => false,
    //       'description' => '',
    //       'example' => '',
    //     ], $params);
    //   }, $item['parameters']);

    //   $schema = [
    //     'type' => 'object',
    //     'properties' => [],
    //   ];
    //   foreach ($params as $paramName => $paramData) {
    //     if ($paramData['in'] != 'body') continue;
    //     $schema['properties'][$paramName] = [
    //       'type' => $paramData['type'],
    //     ];
    //   }

    //   if (!empty($schema['properties'])) {
    //     $this->openapi['components']['schemas'][$name] = $schema;
    //   }

    //   $body = [];
    //   foreach ($params as $paramName => $paramData) {
    //     if ($paramData['in'] == 'body') {
    //       $body[$paramName] = [
    //         'type' => $paramData['type'],
    //       ];
    //     } else {
    //       $item['parameters'][] = [
    //         'name' => $paramName,
    //         'in' => $paramData['in'],
    //         'required' => $paramData['required'],
    //         'schema' => [
    //           'type' => $paramData['type'],
    //         ],
    //       ];
    //     }
    //   }

    //   if (!empty($body)) {
    //     $item['requestBody'] = [
    //       'required' => true,
    //       'content' => [
    //         'application/json' => [
    //           'schema' => [
    //             'type' => 'object',
    //             'properties' => $body,
    //           ],
    //         ],
    //       ],
    //     ];
    //   }

    //   $this->openapi['paths'][$path][$method] = $item;
    // }

    // Route::match($methods, $path, $call)
    //   ->name($name)
    //   ->middleware($middleware);
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
          $args = array_map(function ($arg) use ($method) {
            $arg['call'] = [$method->class, $method->getName()];
            return $arg;
          }, $args);
          $this->route(...$args);
        }
      }
    }
  }

  public function registerSchema($file)
  {
    $schema = include $file;
    $this->schema = array_merge($this->schema, $schema);
  }
}
