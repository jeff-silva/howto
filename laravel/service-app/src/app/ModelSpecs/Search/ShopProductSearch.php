<?php

namespace App\ModelSpecs\Search;

use App\Models\ShopProduct;
use Illuminate\Support\Str;
use Illuminate\Support\Fluent;

class ShopProductSearch extends Search
{
  public $slug = 'shop_product';
  public $name = 'Produtos';
  public $icon = 'mdi:cart';
  public $active = true;
  public $model = \App\Models\ShopProduct::class;

  public function onParams()
  {
    return [
      'order' => 'id:desc',
      'search' => null,
    ];
  }

  public function onQuery($query, $params)
  {
    // if ($params->search) {
    //   $query->where(function ($query) use ($params) {
    //     $words = array_filter(
    //       preg_split('/[^a-zA-Z0-9\p{L}]+/u', $params->search),
    //       fn($word) => strlen($word) >= 3,
    //     );

    //     foreach ($words as $word) {
    //       $query->where(function ($query) use ($word) {
    //         $query->where('name', 'ilike', "%{$word}%")
    //               ->orWhere('description', 'ilike', "%{$word}%");
    //       });
    //     }
    //   });
    // }

    return $query;
  }
}
