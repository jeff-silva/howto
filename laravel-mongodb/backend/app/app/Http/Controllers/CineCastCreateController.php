<?php

namespace App\Http\Controllers;

use App\Models\CineCast;
use Illuminate\Http\Request;

class CineCastCreateController extends Controller
{
    public $methods = ['post'];
    public $route = '/cine_cast';

    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
        ]);

        $entity = CineCast::create($data);
        return compact(['entity']);
    }

    public function openApiModel()
    {
        return CineCast::class;
    }

    public function openApiData()
    {
        return [
            'tags' => ['cine_cast'],
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
