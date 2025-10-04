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
        if (!$entity) return $this->error(400, 'Not found');

        $entity->update($data);
        return compact(['id', 'entity']);
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
            [
                'name' => 'name',
                'in' => 'body',
                'example' => 'John Doe',
            ],
        ];
    }
}
