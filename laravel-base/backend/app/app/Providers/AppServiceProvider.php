<?php

namespace App\Providers;

use Laravel\Sanctum\Sanctum;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

use Modular\Traits\ServiceProviderTrait;

// class SchemaService
// {
//     public $schema = [];
//     public function register($file)
//     {
//         $schema = include $file;
//         $this->schema = array_merge($this->schema, $schema);
//     }

//     public function getSchema()
//     {
//         return $this->schema;
//     }
// }


class AppServiceProvider extends ServiceProvider
{
    use ServiceProviderTrait;

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(\Modular\Providers\ModularServiceProvider::class);

        // $this->app->singleton('schema', function ($app) {
        //     return new SchemaService();
        // });

        // $this->registerSchema(__DIR__ . '/../../database/schema.php');
        // $this->registerModules([
        //     \Modules\Resume\ResumeServiceProvider::class,
        //     \Modules\Ticket\TicketServiceProvider::class,
        // ]);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(\App\Models\AppPersonalAccessToken::class);

        // $this->app->make('route')->bootControllers([
        //     \App\Http\Controllers\AppController::class,
        //     \App\Http\Controllers\AppUserController::class,
        //     \App\Http\Controllers\AuthController::class,
        // ]);

        // $this->bootControllers([
        //     \App\Http\Controllers\AppController::class,
        //     \App\Http\Controllers\AppUserController::class,
        //     \App\Http\Controllers\AuthController::class,
        // ]);
    }
}
