<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(\Modules\Auth\AuthServiceProvider::class);
        $this->app->register(\Modules\Resume\ResumeServiceProvider::class);
        $this->app->register(\Modules\Ticket\TicketServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \App\Http\Controllers\AppController::registerRoutes();
    }
}
