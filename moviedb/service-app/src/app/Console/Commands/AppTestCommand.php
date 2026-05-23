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

        $mdbMovieService = app(\App\Services\MdbMovieService::class);

        $mdbMovies = \App\ModelSpecs\Search\MdbMovieSearch::all();
        foreach ($mdbMovies as $i => $mdbMovie) {
            $mdbMovie = $mdbMovieService->upsert($mdbMovie->toArray());
            dump("{$i}: {$mdbMovie->title}");
        }
    }
}
