<?php

namespace App\Http\Controllers;

use App\Models\CineMovie;
use Illuminate\Http\Request;

class CineMovieUpdateController extends Controller
{
    public $methods = ['put'];
    public $route = '/cine_movie/{id}';

    public function __invoke($id, Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
        ]);

        $entity = CineMovie::find($id);
        if (!$entity) return null;

        $entity->update($data);
        return compact(['id', 'entity']);
    }
}
