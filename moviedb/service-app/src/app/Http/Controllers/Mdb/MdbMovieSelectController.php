<?php

namespace App\Http\Controllers\Mdb;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Http\Controllers\Controller;
use App\Models\MdbMovie;

#[OA\Get(
    path: '/mdb_movie/{id}',
    operationId: 'mdb_movie.select',
    summary: 'Selecionar filme',
    tags: ['Mdb'],
    responses: [
        new OA\Response(response: 200, description: 'Resultado')
    ]
)]

class MdbMovieSelectController extends Controller
{
    public function __invoke(MdbMovie $id, Request $request)
    {
        return [$id];
    }
}
