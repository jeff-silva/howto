<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppTestGetController extends Controller
{
    public $method = 'get';
    public $route = 'app/test';

    public function __invoke(Request $request)
    {
        return ['123'];
    }

    public function openapi()
    {
        return [
            'summary' => 'Teste da aplicação',
            'tags' => ['app', 'test'],
        ];
    }
}
