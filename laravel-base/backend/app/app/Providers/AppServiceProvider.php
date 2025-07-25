<?php

namespace App\Providers;

use Laravel\Sanctum\Sanctum;
use App\Traits\ServiceProviderTrait;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    use ServiceProviderTrait;

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->registerModules([
            \Modules\Resume\ResumeServiceProvider::class,
            \Modules\Ticket\TicketServiceProvider::class,
        ]);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(\App\Models\AppPersonalAccessToken::class);

        $this->bootControllers([
            \App\Http\Controllers\AppController::class,
            \App\Http\Controllers\AppUserController::class,
            \App\Http\Controllers\AuthController::class,
        ]);
    }
}
