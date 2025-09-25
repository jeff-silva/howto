<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public $openapi = true;
    public $method = 'get';
    public $route = '';
    public $middleware = [];

    public function openapi()
    {
        return [];
    }

    public function openapiParams()
    {
        return [];
    }
}
