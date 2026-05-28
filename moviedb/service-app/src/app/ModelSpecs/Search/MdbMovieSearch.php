<?php

namespace App\ModelSpecs\Search;

use App\Models\MdbMovie;
use Illuminate\Support\Str;
use Illuminate\Support\Fluent;
use Illuminate\Support\Facades\Http;

class MdbMovieSearch extends Search
{
  public $slug = 'mdb_movie';
  public $name = 'Filmes';
  public $icon = 'mdi:home';
  public $active = true;
  public $model = \App\Models\MdbMovie::class;

  public function onParams()
  {
    return [
      'order' => 'vote_average:desc',
      'search' => null,
    ];
  }

  public function onQuery($query, $params)
  {
    // $params->search = $this->translate($params->search);
    // $this->searchPopulate($params);

    $supabaseService = app(\App\Services\SupabaseService::class);

    if ($params->search) {
      $query->where(function ($query) use ($params) {
        $words = array_filter(
          preg_split('/[^a-zA-Z0-9]+/', $params->search),
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

      if ($search = $supabaseService->embedding($params->search)) {
        $query->orderByRaw('embedding OPERATOR(extensions.<=>) ?::extensions.vector asc', [$search]);
        $query->orWhere(function ($query) use ($search, $params) {
          $query->whereRaw('(embedding OPERATOR(extensions.<=>) ?::extensions.vector) < 0.22', [$search]);
        });
      }
    }

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

  protected function searchPopulate($params)
  {
    $supabaseService = app(\App\Services\SupabaseService::class);
    $mdbMovieService = app(\App\Services\MdbMovieService::class);
    $items = collect([]);

    // // 01
    // $resp = Http::get('https://imdb.iamidiotareyoutoo.com/search', [
    //     'q' => $params->search,
    //     'tt' => null,
    //     'lsn' => 1,
    //     'v' => 1,
    // ]);

    // foreach ($resp->json('description', []) as $item) {
    //     $item = new Fluent($item);
    //     $item->slug = Str::slug("{$item['#TITLE']} {$item['#YEAR']}");
    //     $item->upsert = [
    //         'slug' => $item->slug,
    //         'title' => $item['#TITLE'],
    //         'original_title' => null,
    //         'image' => $item['#IMG_POSTER'],
    //         'vote_average' => 0,
    //         'vote_count' => 0,
    //         'release_date' => date('Y-m-d', strtotime("{$item['#YEAR']}-01-01")),
    //     ];
    //     $items->push($item);
    // }

    // // 02
    // $resp = Http::get('https://imdb.iamidiotareyoutoo.com/justwatch', [
    //     'q' => $params->search,
    //     'L' => 'en_IN',
    // ]);

    // foreach ($resp->json('description', []) as $item) {
    //     $item = new Fluent($item);
    //     $item->slug = Str::slug("{$item->title} {$item->year}");
    //     $item->upsert = [
    //         'slug' => $item->slug,
    //         'title' => $item->title,
    //         'original_title' => null,
    //         'image' => isset($item->photo_url[0]) ? $item->photo_url[0] : null,
    //         'runtime' => $item->runtime,
    //         'vote_average' => 0,
    //         'vote_count' => 0,
    //         'release_date' => date('Y-m-d', strtotime("{$item->year}-01-01")),
    //     ];
    //     $items->push($item);
    // }

    // // 03
    // $resp = Http::get('https://api.imdbapi.dev/search/titles', [
    //     'query' => $params->search,
    // ]);

    // foreach ($resp->json('titles', []) as $item) {
    //     $item = new Fluent($item);
    //     $item->slug = Str::slug("{$item->originalTitle} {$item->startYear}");
    //     $item->upsert = [
    //         'slug' => $item->slug,
    //         'title' => $item->primaryTitle,
    //         'original_title' => $item->originalTitle,
    //         'image' => $item->primaryImage['url'] ?? null,
    //         'vote_average' => $item->rating['aggregateRating'] ?? 0,
    //         'vote_count' => $item->rating['voteCount'] ?? 0,
    //         'release_date' => date('Y-m-d', strtotime("{$item->startYear}-01-01")),
    //     ];
    //     $items->push($item);
    // }

    // TMDB Search
    $resp = Http::withHeaders([
      'Authorization' => 'Bearer ' . env('TMDB_API_TOKEN'),
    ])
      ->get('https://api.themoviedb.org/3/search/movie', [
        'query' => $params->search,
        'page' => $params->page,
        'include_adult' => true,
        'language' => 'en-US',
        'page' => 1,
      ]);

    foreach ($resp->json('results', []) as $item) {
      $item = new Fluent($item);

      if (!$item->release_date) continue;
      if (!$item->overview) continue;
      if (!$item->poster_path) continue;
      if (!$item->vote_average or !$item->vote_count) continue;

      $item->slug = Str::slug($item->original_title . ' ' . date('Y', strtotime($item->release_date)));
      $item->upsert = [
        'slug' => $item->slug,
        'title' => $item->title,
        'original_title' => $item->original_title,
        'image' => $item->poster_path ? "https://image.tmdb.org/t/p/w500{$item->poster_path}" : null,
        'vote_average' => $item->vote_average ?? 0,
        'vote_count' => $item->vote_count ?? 0,
        'release_date' => date('Y-m-d', strtotime("{$item->release_date}-01-01")),
        'overview' => $item->overview,
        'original_language' => $item->original_language,
      ];
      $items->push($item);
    }

    file_put_contents(storage_path('logs/laravel.log'), json_encode([
      'params' => $params,
      'response' => $resp->json(),
    ], JSON_PRETTY_PRINT));

    foreach ($items as $item) {
      $mdbMovieService->upsert($item->upsert);
    }
  }
}
