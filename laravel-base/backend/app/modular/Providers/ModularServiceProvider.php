<?php

namespace Modular\Providers;

use Illuminate\Support\ServiceProvider;
use Modular\Services\ModularService;

class ModularServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   */
  public function register(): void
  {
    $this->app->singleton('modular', function ($app) {
      return new ModularService();
    });

    // $modules = include base_path('/modular/modules.php');
    // foreach ($modules['serviceProviders'] as $provider) {
    //   $this->app->register($provider);
    // }
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    if ($this->app->runningInConsole()) {
      $this->commands([
        \Modular\Console\Commands\ModularInitCommand::class,
      ]);
    }
  }
}
