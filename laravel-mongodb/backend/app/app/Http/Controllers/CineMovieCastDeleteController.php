<?php

namespace App\Http\Controllers;

use App\Models\CineMovieCast;
use Illuminate\Http\Request;

class CineMovieCastDeleteController extends Controller
{
    public $methods = ['delete'];
    public $route = '/cine_movie_cast/{id}';

    public function __invoke($id, Request $request)
    {
        $entity = CineMovieCast::find($id);
        if (!$entity) return $this->error(400, 'Not found');
        $entity->delete();
        return compact(['entity']);
    }

    public function openApiModel()
    {
        return CineMovieCast::class;
    }

    public function openApiData()
    {
        return [
            'tags' => ['cine_movie_cast'],
        ];
    }

    public function openApiParams()
    {
        return [
            [
                'name' => 'id',
                'in' => 'path',
                'example' => 123,
            ],
        ];
    }
}
