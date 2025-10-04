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
                'name' => 'name',
                'in' => 'body',
                'example' => 'John Doe',
            ],
        ];
    }
}
