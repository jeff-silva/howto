<?php

namespace App\Http\Controllers;

use App\Models\CineCast;
use Illuminate\Http\Request;

class CineCastUpdateController extends Controller
{
    public $methods = ['put'];
    public $route = '/cine_cast/{id}';

    public function __invoke($id, Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
        ]);

        $entity = CineCast::find($id);
        if (!$entity) return $this->error(400, 'Not found');

        $entity->update($data);
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
            [
                'name' => 'name',
                'in' => 'body',
                'example' => 'John Doe',
            ],
        ];
    }
}
