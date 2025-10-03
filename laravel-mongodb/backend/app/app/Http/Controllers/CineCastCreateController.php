<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CineCastCreateController extends Controller
{
    public $methods = ['post'];
    public $route = '/cine_cast';

    public function __invoke(Request $request)
    {
        return ['create'];
    }
}
