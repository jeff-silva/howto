<?php

namespace Modular\Attributes;

// use Illuminate\Support\Facades\Route as LaravelRoute;

class Route
{
    public function __construct(
        $path = '/',
        $methods = ['get'],
        $name = null,
        $call = [],
        $middleware = [],
        $params = []
    ) {
        app()->make('modular')->route(
            path: $path,
            methods: $methods,
            name: $name,
            call: $call,
            middleware: $middleware,
            params: $params
        );
        // $methods = array_map('strtoupper', $methods);
        // LaravelRoute::match($methods, $path, $call)
        //     ->name($name)
        //     ->middleware($middleware);
    }
}
