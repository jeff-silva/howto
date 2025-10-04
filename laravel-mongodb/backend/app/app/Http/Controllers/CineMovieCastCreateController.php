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
