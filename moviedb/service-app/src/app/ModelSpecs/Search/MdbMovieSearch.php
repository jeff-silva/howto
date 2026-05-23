<?php

namespace App\ModelSpecs\Search;

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
            'order' => 'id:asc',
            'search' => null,
        ];
    }

    public function onQuery($query, $params)
    {
        $supabaseService = app(\App\Services\SupabaseService::class);

        if ($params->search) {
            $search = $supabaseService->embedding($params->search);
            $query->whereRaw('(embedding OPERATOR(extensions.<=>) ?::extensions.vector) < 0.3', [$search]);
            $query->orderByRaw('embedding OPERATOR(extensions.<=>) ?::extensions.vector asc', [$search]);
        }

        return $query;
    }
}
