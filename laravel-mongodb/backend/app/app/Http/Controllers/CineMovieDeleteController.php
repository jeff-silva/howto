<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CineMovieDeleteController extends Controller
{
    public $methods = ['delete'];
    public $route = '/cine_movie/{id}';

    public function __invoke(Request $request)
    {
        return ['delete'];
    }
}
