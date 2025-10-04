<?php

namespace App\Http\Controllers;

use App\Models\CineMovieCast;
use Illuminate\Http\Request;

class CineMovieCastCreateController extends Controller
{
    public $methods = ['post'];
    public $route = '/cine_movie_cast';

    public function __invoke(Request $request)
    {
        $request->validate([
            'name' => ['required'],
        ]);

        $entity = CineMovieCast::create($request->all());
        return compact(['entity']);
    }
}
