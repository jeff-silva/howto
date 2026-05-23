<?php

namespace App\ModelSpecs\Search;

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
        $supabaseService = app(\App\Services\SupabaseService::class);

        if ($params->search) {
            $params->search = $this->translate($params->search);
            $search = $supabaseService->embedding($params->search);
            $query->where(function ($q) use ($search, $params) {
                $q->whereRaw('(embedding OPERATOR(extensions.<=>) ?::extensions.vector) < 0.22', [$search]);

                $words = preg_split('/[^a-zA-Z0-9]+/', $params->search);
                $words = array_filter($words, function ($word) {
                    return strlen($word) >= 3;
                });

                if (!empty($words)) {
                    $q->orWhere(function ($subQuery) use ($words) {
                        foreach ($words as $word) {
                            $subQuery->where('embedding_text', 'ilike', "%{$word}%");
                        }
                    });
                }
            });
            $query->orderByRaw('embedding OPERATOR(extensions.<=>) ?::extensions.vector asc', [$search]);
            // file_put_contents(storage_path('logs/laravel.log'), json_encode($params, JSON_PRETTY_PRINT));
        }

        return $query;
    }

    protected function translate(string $text, $from = 'pt')
    {
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
