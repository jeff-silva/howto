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
        $data = $request->validate([
            'name' => ['required'],
        ]);

        $entity = CineMovieCast::create($data);
        return compact(['entity']);
    }
}
