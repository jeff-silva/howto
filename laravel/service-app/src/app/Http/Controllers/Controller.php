<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;

class Controller
{
    static function apis(array $classes = [])
    {
        $files = [];

        foreach ($classes as $class) {
            $reflection = new \ReflectionClass($class);
            $files[] = $reflection->getFileName();
            $attributes = $reflection->getAttributes();
            foreach ($attributes as $attribute) {
                if (str_starts_with($attribute->getName(), 'OpenApi\\Attributes\\')) {
                    $oa = $attribute->newInstance();
                    if (property_exists($oa, 'path')) {
                        $method = strtoupper(collect(explode('\\', $attribute->getName()))->last());
                        Route::match($method, $oa->path, $class);
                    }
                }
            }
        }

        Route::get('/openapi', function () use ($files) {
            $files = array_merge($files, [
                app_path('Models')
            ]);

            $openapi = (new \OpenApi\Generator())->generate($files);
            $openapi = json_decode($openapi->toJson(), true);
            $openapi['info']['title'] = env('APP_NAME');
            $openapi['servers'] = [[
                'url' => url('/api'),
                'description' => 'URL Principal',
            ]];

            return $openapi;
        });
    }
}
