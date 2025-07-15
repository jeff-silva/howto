<?php

namespace App\Auth;

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
        Sanctum::usePersonalAccessTokenModel(\App\Auth\Models\AppPersonalAccessToken::class);

        // Register routes
        \App\Auth\Http\Controllers\AppController::registerRoutes();
        \App\Auth\Http\Controllers\AppUserController::registerRoutes();
        \App\Auth\Http\Controllers\AuthController::registerRoutes();
    }
}
