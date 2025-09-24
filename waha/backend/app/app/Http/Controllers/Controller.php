<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public $method = 'get';
    public $route = '';

    public function openapi()
    {
        return [];
    }

    public function openapiParams()
    {
        return [];
    }
}
