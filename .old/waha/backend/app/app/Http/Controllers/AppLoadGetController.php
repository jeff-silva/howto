<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppLoadGetController extends Controller
{
    public $methods = ['get'];
    public $route = 'app/load';

    public function __invoke(Request $request)
    {
        $user = null;
        return compact(['user']);
    }

    public function openapi()
    {
        return [
            'tags' => ['app'],
        ];
    }
}
