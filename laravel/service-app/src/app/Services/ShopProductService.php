<?php

namespace App\Services;

use App\Models\ShopProduct;
use Illuminate\Support\Str;
use Illuminate\Support\Fluent;
use Illuminate\Database\Eloquent\Model;

class ShopProductService extends Service
{
  /** @var \App\Models\ShopProduct */
  public $model = \App\Models\ShopProduct::class;

  public function upsert(array $data = [], array $params = [])
  {
    $supabaseService = app(\App\Services\SupabaseService::class);
    $data = new Fluent($data);

    if ($shopProduct = $this->model->find($data->id)) {
      $shopProduct->fill($data->toArray());
      $data = new Fluent($shopProduct->toArray());
    }

    $data->embedding_text = '';
    $data->embedding_text .= "Name: {$data->name}\n";
    $data->embedding_text .= "Price: {$data->price}\n";
    $data->embedding_text .= "Description: {$data->description}";
    $data->embedding = $supabaseService->embedding($data->embedding_text);

    return parent::upsert($data->toArray(), $params);
  }
}
