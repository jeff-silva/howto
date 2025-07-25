<?php

namespace Modules\Auth;

use Laravel\Sanctum\Sanctum;
use App\Traits\ServiceProviderTrait;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    use ServiceProviderTrait;

    public function register(): void
    {
        $this->mergeConfigDeep(__DIR__ . '/config/app_config.php', 'app_config');
    }


    public function boot(): void
    {
        // Replace default Sanctum model
        Sanctum::usePersonalAccessTokenModel(\Modules\Auth\Models\AppPersonalAccessToken::class);

        // // Register routes
        // \Modules\Auth\Http\Controllers\AppUserController::registerRoutes();
        // \Modules\Auth\Http\Controllers\AuthController::registerRoutes();

        $this->bootControllers([
            \Modules\Auth\Http\Controllers\AppUserController::class,
            \Modules\Auth\Http\Controllers\AuthController::class,
        ]);
    }
}
