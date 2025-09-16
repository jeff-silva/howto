<?php

namespace App\Modular;

use Illuminate\Support\ServiceProvider;
use Modular\Services\ModularService;

class ModularServiceProvider extends ServiceProvider
{
  public $modules = [];
  /**
   * Register any application services.
   */
  public function register(): void
  {
    $this->app->singleton('modular', function ($app) {
      return new ModularService();
    });

    $this->modules = include base_path('/modular/modules.php');
    foreach ($this->modules['serviceProviders'] as $provider) {
      $this->app->register($provider);
    }
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    if ($this->app->runningInConsole()) {
      $this->commands([
        \Modular\Console\Commands\ModularInitCommand::class,
        ...$this->modules['commands']
      ]);
    }

    // $this->app->make('modular')->bootControllers($this->modules['controllers']);
  }
}
