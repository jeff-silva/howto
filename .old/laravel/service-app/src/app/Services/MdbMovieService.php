<?php

namespace App\Services;

use App\Models\MdbMovie;
use Illuminate\Support\Str;
use Illuminate\Support\Fluent;
use Illuminate\Database\Eloquent\Model;

class MdbMovieService extends Service
{
    public $model = \App\Models\MdbMovie::class;

    public function upsert(array $data = [], array $params = [])
    {
        $supabaseService = app(\App\Services\SupabaseService::class);
        $data = new Fluent($data);

        if ($this->model instanceof Model) {
            $model = $this->model->query()
                ->where('id', $data->id)
                ->orWhere('slug', $data->slug)
                ->first();

            if ($model) {
                $data = new Fluent(
                    array_merge($model->toArray(), $data->toArray())
                );
            }
        }

        $data->slug = Str::slug(($data->original_title ?? $data->title) . '-' . date('Y', strtotime($data->release_date)));

        $embedding = [];
        $embedding[] = "Title: " . ($data->original_title ?? $data->title) . " (" . date('Y', strtotime($data->release_date)) . ")";

        if ($value = collect($data->genres)->pluck('name')->implode(', ')) {
            $embedding[] = "Genres: {$value}";
        }

        if ($value = collect($data->keywords)->pluck('name')->implode(', ')) {
            $embedding[] = "Keywords: {$value}";
        }

        if ($data->overview) {
            $embedding[] = '';
            $embedding[] = 'Overview:';
            $embedding[] = $data->overview;
        }

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

        if ($data->original_language) {
            $embedding[] = '';
            $embedding[] = "Original Language: {$data->original_language}";
        }

        $data->embedding_text = join("\n", $embedding);
        $data->embedding = $supabaseService->embedding($data->embedding_text);
        return parent::upsert($data->toArray(), $params);
    }
}
