<?php

namespace App\Console\Commands;

use Illuminate\Support\Fluent;
use Illuminate\Console\Command;
use Illuminate\Console\Attributes;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

#[Attributes\Signature('app:test')]
#[Attributes\Description('Test')]

class AppTestCommand extends Command
{
  public function handle()
  {
    // $supabaseService = app(\App\Services\SupabaseService::class);
    // $resp = $supabaseService->embedding('Olá mundo');
    // dump($resp);

    // $mdbMovieService = app(\App\Services\MdbMovieService::class);
    // $mdbMovies = \App\ModelSpecs\Search\MdbMovieSearch::all();
    // $mdbMoviesTotal = $mdbMovies->count() - 1;
    // foreach ($mdbMovies as $i => $mdbMovie) {
    //     $mdbMovie = $mdbMovieService->upsert($mdbMovie->toArray());
    //     dump("{$i} / {$mdbMoviesTotal}: {$mdbMovie->title}");
    // }

    // $shopProductService = app(\App\Services\ShopProductService::class);
    // $shopProductService->upsert(json_decode('{
    //   "name": "Smartphone Motorola Moto G84 5G 256GB",
    //   "price": 1799.0,
    //   "promo_price": 1528.97,
    //   "promo_start": "2026-05-28",
    //   "promo_final": "2026-06-10",
    //   "image": "https://loremflickr.com/500/500/motorola,smartphone?lock=0",
    //   "description": "O Motorola Moto G84 5G oferece fotos ultra nítidas com câmera de 50 MP e estabilização óptica, tela pOLED premium de 6,5 polegadas e super performance com 256GB de memória interna."
    // }', true));

    $shopProductService = app(\App\Services\ShopProductService::class);
    $shopProductItems = \App\ModelSpecs\Search\ShopProductSearch::all();
    $shopProductCount = $shopProductItems->count();
    foreach ($shopProductItems as $i => $item) {
      $shopProductService->upsert($item->toArray());
      dump("Update {$i} / {$shopProductCount}: {$item->name}");
    }

    // $shopProductService = app(\App\Services\ShopProductService::class);
    // $resp = $this->meliRequest('get', '/products/search', [
    //   'status'  => 'active',
    //   'site_id' => 'MLB',
    //   'q'       => 'a',
    //   'limit'   => 2
    // ]);

    // dd($resp);

    // foreach ($resp->results as $item) {
    //   $item = new Fluent($item);
    //   $shopProduct = \App\Models\ShopProduct::firstOrNew(['slug' => $item->id]);
    //   $save = new Fluent($shopProduct->toArray());
    //   $save->name = $item->name;
    //   $save->image_url = isset($item->pictures[0]) ? $item->pictures[0]['url'] : null;
    //   dd($item->toArray(), $save->toArray());

    //   $shopProductService->upsert($save->toArray());
    // }

    // dd($resp->json());
  }

  protected function meliRequest(string $method, string $url, array $data = [])
  {
    $method = strtoupper($method);
    $url = "https://api.mercadolibre.com{$url}";

    $options = [];
    if (in_array($method, ['GET'])) {
      $options['query'] = $data;
    } else if (in_array($method, ['POST', 'PUT'])) {
      $options['json'] = $data;
    }

    $token = Cache::remember('meli_token', now()->addHours(5), function () {
      $resp = \Illuminate\Support\Facades\Http::asForm()
        ->post('https://api.mercadolibre.com/oauth/token', [
          'grant_type'    => 'client_credentials',
          'client_id'     => '6618624106742765',
          'client_secret' => 'I3vy4lJGiubOOu3Ei4IRshZuqa7MIBGb',
        ]);

      return $resp->json('access_token');
    });

    $cache_time = 300;
    $cache_key = 'meli_' . md5(json_encode([$method, $url, $options, $cache_time]));
    $resp = Cache::remember($cache_key, $cache_time, function () use ($method, $url, $options, $token) {
      $resp = Http::withToken($token)->send($method, $url, $options);
      return $resp->json();
    });

    return new Fluent($resp);
  }
}
