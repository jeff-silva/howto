<?php

namespace App\Http\Controllers;

use App\Models\CineMovieCast;
use Illuminate\Http\Request;

class CineMovieCastUpdateController extends Controller
{
    public $methods = ['put'];
    public $route = '/cine_movie_cast/{id}';

    public function __invoke($id, Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
        ]);

        $entity = CineMovieCast::find($id);
        if (!$entity) return null;

        $entity->update($data);
        return compact(['id', 'entity']);
    }
}
