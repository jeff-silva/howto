<?php

namespace App\Http\Controllers;

use App\Models\CineCast;
use Illuminate\Http\Request;

class CineCastDeleteController extends Controller
{
    public $methods = ['delete'];
    public $route = '/cine_cast/{id}';

    public function __invoke($id, Request $request)
    {
        $entity = CineCast::find($id);
        if (!$entity) return $this->error(400, 'Not found');
        $entity->delete();
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
                'name' => 'id',
                'in' => 'path',
                'example' => 123,
            ],
        ];
    }
}
