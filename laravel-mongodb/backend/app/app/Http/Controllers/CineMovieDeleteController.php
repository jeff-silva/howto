<?php

namespace App\Http\Controllers;

use App\Models\CineMovie;
use Illuminate\Http\Request;

class CineMovieDeleteController extends Controller
{
    public $methods = ['delete'];
    public $route = '/cine_movie/{id}';

    public function __invoke($id, Request $request)
    {
        $entity = CineMovie::find($id);
        if (!$entity) return $this->error(400, 'Not found');
        $entity->delete();
        return compact(['entity']);
    }

    public function openApiModel()
    {
        return CineMovie::class;
    }

    public function openApiData()
    {
        return [
            'tags' => ['cine_movie'],
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
