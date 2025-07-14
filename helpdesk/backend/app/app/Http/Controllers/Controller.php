<?php

namespace App\Http\Controllers;

use ReflectionClass;
use ReflectionMethod;
use Attribute;

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

abstract class Controller
{
    static function register()
    {
        $classRef = new ReflectionClass(get_called_class());
        foreach ($classRef->getMethods() as $method) {
            if ($method->isStatic()) continue;
            if (!$method->isPublic()) continue;
            $attributes = $method->getAttributes(\App\Attributes\Route::class);
            if (empty($attributes)) continue;
            $route = $attributes[0]->newInstance();
            // dd($route);
            Route::match($route->methods, $route->path, [$classRef->getName(), $method->getName()])
                ->name($route->name)
                ->middleware($route->middleware);
        }
    }
}
