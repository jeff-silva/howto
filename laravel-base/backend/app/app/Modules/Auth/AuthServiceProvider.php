<?php

namespace App\Modules\Auth;

use Laravel\Sanctum\Sanctum;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // dump('SsoServiceProvider::register');
    }


    public function boot(): void
    {
        // Replace default Sanctum model
        Sanctum::usePersonalAccessTokenModel(\App\Modules\Auth\Models\AppPersonalAccessToken::class);

        // Register routes
        \App\Modules\Auth\Http\Controllers\AppUserController::registerRoutes();
        \App\Modules\Auth\Http\Controllers\AuthController::registerRoutes();
    }
}
