<?php

namespace Modular\Traits;

trait ServiceProviderTrait
{
  public function mergeConfigDeep($module_file, $config_key)
  {
    $config = collect(config($config_key));
    $config = $config->replaceRecursive(include $module_file)->toArray();
    config([$config_key => $config]);
    return $config;
  }

  public function bootRoutes($controllers = [])
  {
    $this->app->make('modular')->bootRoutes($controllers);
  }

  public function registerSchema($file)
  {
    $this->app->make('modular')->registerSchema($file);
  }
}
