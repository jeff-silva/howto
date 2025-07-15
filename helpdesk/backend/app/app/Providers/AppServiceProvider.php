<?php

namespace App\Providers;

use Laravel\Sanctum\Sanctum;
use App\Models\AppPersonalAccessToken;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(AppPersonalAccessToken::class);
    }
}
