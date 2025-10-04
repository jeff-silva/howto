<?php

namespace App\Http\Controllers;

use App\Models\CineMovie;
use Illuminate\Http\Request;

class CineMovieCreateController extends Controller
{
    public $methods = ['post'];
    public $route = '/cine_movie';

    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
        ]);

        $entity = CineMovie::create($data);
        return compact(['entity']);
    }
}
