<?php

namespace App\Http\Controllers;

use ReflectionClass;
use ReflectionMethod;
use Attribute;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;

abstract class Controller
{
    static function registerRoutes()
    {
        $classRef = new ReflectionClass(get_called_class());
        foreach ($classRef->getMethods() as $method) {
            if ($method->isStatic()) continue;
            if (!$method->isPublic()) continue;
            $attributes = $method->getAttributes(\App\Attributes\Route::class);
            if (empty($attributes)) continue;
            foreach($attributes as $attr) {
                $args = $attr->getArguments();
                // $args['call'] = [new $classRef->name(), $method->getName()];
                $args['call'] = [$classRef->name, $method->getName()];
                new $attr->name(...$args);
            }
            // $route = $attributes[0]->newInstance(
            //     methods: $route->methods,
            //     path: $route->path,
            //     name: $route->name,
            //     middleware: $route->middleware,
            //     call: [$classRef->getName(), $method->getName()],
            // );
            // dd($route);
            // Route::match($route->methods, $route->path, [$classRef->getName(), $method->getName()])
            //     ->name($route->name)
            //     ->middleware($route->middleware);
        }
    }
}
