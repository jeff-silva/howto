<?php

namespace App\Attributes; // Seu namespace para os atributos

use Attribute;

#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_CLASS)] // Pode ser usado em métodos e classes
class Route
{
    public function __construct(
        public string $path,
        public array $methods = ['get'],
        public ?string $name = null, // Opcional: nome da rota
        public array $middleware = [], // Opcional: middlewares específicos
    ) {}
}
