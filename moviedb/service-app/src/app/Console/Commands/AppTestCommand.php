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
        $supabaseService = app(\App\Services\SupabaseService::class);
        $resp = $supabaseService->embedding('Olá mundo');
        dump($resp);
    }
}
