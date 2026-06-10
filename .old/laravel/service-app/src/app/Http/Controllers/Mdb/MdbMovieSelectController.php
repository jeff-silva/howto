<?php

namespace App\Http\Controllers\Mdb;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Http\Controllers\Controller;
use App\ModelSpecs\Search\MdbMovieSearch;

#[OA\Get(
  path: '/mdb_movie/{id}',
  operationId: 'MdbMovieSelect',
  summary: 'Selecionar filme',
  tags: ['Mdb'],
  responses: [
    new OA\Response(response: 200, description: 'Resultado')
  ]
)]

class MdbMovieSelectController extends Controller
{
  public function __invoke($id, Request $request)
  {
    $scope = (object) [];

    $scope->entity = MdbMovieSearch::first(
      array_merge($request->query(), ['only' => $id])
    );

    return $scope;
  }
}
