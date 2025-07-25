<?php

namespace Modules\Auth;

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
        Sanctum::usePersonalAccessTokenModel(\Modules\Auth\Models\AppPersonalAccessToken::class);

        // Register routes
        \Modules\Auth\Http\Controllers\AppUserController::registerRoutes();
        \Modules\Auth\Http\Controllers\AuthController::registerRoutes();
    }
}
