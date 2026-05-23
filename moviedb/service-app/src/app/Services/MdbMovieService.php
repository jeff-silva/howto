<?php

namespace App\Services;

use Illuminate\Support\Fluent;

class MdbMovieService extends Service
{
    public $model = \App\Models\MdbMovie::class;

    public function upsert(array $data = [], array $params = [])
    {
        $supabaseService = app(\App\Services\SupabaseService::class);
        $data = new Fluent($data);

        $embedding = [];
        $embedding[] = "Title: {$data->original_title} (" . date('Y', strtotime($data->release_date)) . ")";
        $embedding[] = "Overview: {$data->overview}";
        $embedding[] = "Tagline: {$data->tagline}";
        $embedding[] = "Vote Avarage: {$data->vote_average} / 10";
        $embedding[] = "Popularity: {$data->popularity}";
        $embedding[] = "Genres: " . collect($data->genres)->pluck('name')->implode(', ');
        $embedding[] = "Keywords: " . collect($data->keywords)->pluck('name')->implode(', ');
        $embedding[] = "Production Countries: " . collect($data->production_countries)->pluck('name')->implode(', ');
        $embedding[] = "Spoken Languages: " . collect($data->spoken_languages)->pluck('name')->implode(', ');
        $data['embedding'] = $supabaseService->embedding(join("\n", $embedding));
        // dd($data);

        return parent::upsert($data->toArray(), $params);
    }
}
