<?php

namespace App\Providers;

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
            \Modules\Auth\AuthServiceProvider::class,
            \Modules\Resume\ResumeServiceProvider::class,
            \Modules\Ticket\TicketServiceProvider::class,
        ]);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // \App\Http\Controllers\AppController::registerRoutes();

        $this->bootControllers([
            \App\Http\Controllers\AppController::class,
        ]);
    }
}
