<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Fluent;

class MdbMovieService extends Service
{
    public $model = \App\Models\MdbMovie::class;

    public function upsert(array $data = [], array $params = [])
    {
        $supabaseService = app(\App\Services\SupabaseService::class);
        $data = new Fluent($data);

        if ($this->model instanceof Model) {
            $model = $this->model->firstOrNew(['id' => $data->id], $data->toArray());

            $embedding = [];
            $embedding[] = "Title: {$data->original_title} (" . date('Y', strtotime($data->release_date)) . ")";
            $embedding[] = "Genres: " . collect($data->genres)->pluck('name')->implode(', ');
            $embedding[] = "Keywords: " . collect($data->keywords)->pluck('name')->implode(', ');
            $embedding[] = "Vote Avarage: {$data->vote_average} / 10";
            $embedding[] = "Overview: {$data->overview}";

            if (!empty($model->credit->cast)) {
                $embedding[] = '';
                $embedding[] = 'Cast:';
                foreach ($model->credit->cast as $item) {
                    $embedding[] = "- {$item['name']} as {$item['character']}";
                }
            }

            if (!empty($model->credit->crew)) {
                $embedding[] = '';
                $embedding[] = 'Crew:';
                foreach ($model->credit->crew as $item) {
                    $embedding[] = "- {$item['job']}: {$item['name']}";
                }
            }


            $embedding[] = "Popularity: {$data->popularity}";
            $embedding[] = "Original Language: {$data->original_language}";

            $data['embedding_text'] = join("\n", $embedding);
            $data['embedding'] = $supabaseService->embedding($data['embedding_text']);
        }

        return parent::upsert($data->toArray(), $params);
    }
}
