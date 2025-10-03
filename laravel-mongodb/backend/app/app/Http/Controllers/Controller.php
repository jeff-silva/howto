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
        $this->name = $this->name ?? class_basename(get_called_class());
    }

    static function register($controller)
    {
        $c = app($controller);
        Route::match($c->methods, $c->route, $controller)->name($c->name)->middleware($c->middlewares);
    }
}
