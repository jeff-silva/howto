<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CineCastDeleteController extends Controller
{
    public $methods = ['delete'];
    public $route = '/cine_cast/{id}';

    public function __invoke(Request $request)
    {
        return ['delete'];
    }
}
