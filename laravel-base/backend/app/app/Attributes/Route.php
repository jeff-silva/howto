<?php

namespace App\Attributes; // Seu namespace para os atributos

use Attribute;
use Illuminate\Support\Facades\Route as LaravelRoute;

// #[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_CLASS)] // Pode ser usado em métodos e classes
class Route
{
    public function __construct(
        public string $path,
        public array $methods = ['get'],
        public ?string $name = null,
        public array $middleware = [],
        public array $call = [],
    ) {
        $methods = array_map('strtoupper', $methods);

        LaravelRoute::match($methods, $path, $call)
            ->name($name)
            ->middleware($middleware);
    }
}
