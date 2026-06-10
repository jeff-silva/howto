<?php

namespace App\Http\Controllers\ShopProduct;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Http\Controllers\Controller;
use App\ModelSpecs\Search\ShopProductSearch;

#[OA\Get(
  path: '/shop_product',
  operationId: 'ShopProductSearch',
  summary: 'Buscar produtos',
  tags: ['ShopProduct'],
  responses: [
    new OA\Response(response: 200, description: 'Resultado')
  ]
)]

class ShopProductSearchController extends Controller
{
  public function __invoke(Request $request)
  {
    return ShopProductSearch::paginated($request->query());
  }
}
