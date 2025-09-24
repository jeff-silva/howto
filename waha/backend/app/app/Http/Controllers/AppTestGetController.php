<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppTestGetController extends Controller
{
    public $method = 'get';
    public $route = 'app/test';

    public function __invoke(Request $request)
    {
        $all = $request->all();
        return compact(['all']);
    }

    public function openapi()
    {
        return [
            'tags' => ['app', 'test'],
        ];
    }

    public function openapiParams()
    {
        return [
            ['in' => 'query', 'name' => 'page', 'description' => 'Página'],
            ['in' => 'query', 'name' => 'per_page', 'description' => 'Ítens por página'],
            ['in' => 'query', 'name' => 'order', 'description' => 'Ordem'],
        ];
    }
}
