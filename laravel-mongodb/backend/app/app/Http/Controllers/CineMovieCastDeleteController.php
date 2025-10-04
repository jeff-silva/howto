<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CineMovieCastDeleteController extends Controller
{
    public $methods = ['delete'];
    public $route = '/cine_movie_cast/{id}';

    public function __invoke(Request $request)
    {
        return ['delete'];
    }
}
