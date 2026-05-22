<?php

namespace App\Http\Controllers\Mdb;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Http\Controllers\Controller;

#[OA\Post(
    path: '/mdb_movie',
    operationId: 'mdb_movie.upsert',
    summary: 'Criar/Alterar filme',
    tags: ['Mdb'],
    responses: [
        new OA\Response(response: 200, description: 'Resultado')
    ]
)]

class MdbMovieUpsertController extends Controller
{
    public function __invoke(Request $request)
    {
        return response()->json(['message' => 'sucesso']);
    }
}
