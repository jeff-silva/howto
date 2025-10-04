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
        if (!$entity) return $this->error(400, 'Not found');

        $entity->update($data);
        return compact(['id', 'entity']);
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
            [
                'name' => 'name',
                'in' => 'body',
                'example' => 'John Doe',
            ],
            [
                'name' => 'cine_cast_id',
                'in' => 'body',
                'example' => 123,
            ],
            [
                'name' => 'cine_movie_id',
                'in' => 'body',
                'example' => 123,
            ],
        ];
    }
}
