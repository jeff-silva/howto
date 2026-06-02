<?php

namespace App\ModelSpecs\Search;

use App\Models\ShopProduct;
use Illuminate\Support\Str;
use Illuminate\Support\Fluent;
use Illuminate\Support\Facades\Http;

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
      'search' => null,
    ];
  }

  public function onQuery($query, $params)
  {
    $supabaseService = app(\App\Services\SupabaseService::class);
    $params->search_en = $this->translate($params->search);

    if ($search = $params->search_en) {
      $search = $supabaseService->embedding($search);
      $query->orderByRaw('embedding OPERATOR(extensions.<=>) ?::extensions.vector asc', [$search]);
      $query->orWhere(function ($query) use ($search, $params) {
        $query->whereRaw('(embedding OPERATOR(extensions.<=>) ?::extensions.vector) < 0.22', [$search]);
      });

      $query->orWhere(function ($query) use ($params) {
        $words = array_filter(
          preg_split('/[^a-zA-Z0-9]+/', $params->search_en),
          fn($word) => strlen($word) >= 3,
        );

        $isOr = sizeof($words) > 3;

        foreach ($words as $word) {
          if ($isOr) {
            $query->orWhere('embedding_text', 'ilike', "%{$word}%");
            continue;
          }

          $query->where('embedding_text', 'ilike', "%{$word}%");
        }
      });
    }

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

    \LogHelper::put($params);
    return $query;
  }

  protected function translate(null | string $text, $from = 'pt')
  {
    if (!$text) return $text;

    try {
      $req = Http::get('https://translate.googleapis.com/translate_a/single', [
        'client' => 'gtx',
        'sl' => $from,
        'tl' => 'en',
        'dt' => 't',
        'q' => $text
      ]);

      if ($req->successful()) {
        $data = $req->json();
        return $data[0][0][0] ?? '';
      }
    } catch (\Exception $e) {
    }

    return $text;
  }
}
