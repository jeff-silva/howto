<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CineCastUpdateController extends Controller
{
    public $methods = ['put'];
    public $route = '/cine_cast/{id}';

    public function __invoke(Request $request)
    {
        return ['update'];
    }
}
