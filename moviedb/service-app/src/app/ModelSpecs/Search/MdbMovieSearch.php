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
        ];
    }

    public function onQuery($query, $params)
    {
        // if ($params->type) {
        //     $query->where('type', $params->type);
        // }

        return $query;
    }
}
