<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes;
use Illuminate\Console\Command;

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
    foreach ($shopProductItems as $item) {
      $shopProductService->upsert($item->toArray());
      dump("Update: {$item->name}");
    }
  }
}
