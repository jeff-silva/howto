<?php

namespace App\Http\Controllers\ShopProduct;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Http\Controllers\Controller;
use App\ModelSpecs\Search\ShopProductSearch;

#[OA\Get(
  path: '/shop_product/{id}',
  operationId: 'ShopProductSelect',
  summary: 'Selecionar produto',
  tags: ['ShopProduct'],
  responses: [
    new OA\Response(response: 200, description: 'Resultado')
  ]
)]

class ShopProductSelectController extends Controller
{
  public function __invoke($id, Request $request)
  {
    $scope = (object) [];

    $scope->entity = ShopProductSearch::first(
      array_merge($request->query(), ['only' => $id])
    );

    return $scope;
  }
}
