<?php

namespace App\Http\Controllers\Mdb;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Http\Controllers\Controller;
use App\ModelSpecs\Search\MdbMovieSearch;

#[OA\Get(
    path: '/mdb_movie',
    operationId: 'mdb_movie.search',
    summary: 'Buscar filmes',
    tags: ['Mdb'],
    responses: [
        new OA\Response(response: 200, description: 'Resultado')
    ]
)]

class MdbMovieSearchController extends Controller
{
    public function __invoke(Request $request)
    {
        return MdbMovieSearch::paginated($request->query());
    }
}
