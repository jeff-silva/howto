<?php

namespace App\Traits;

trait ServiceProviderTrait
{
    public function mergeConfigDeep($module_file, $config_key)
    {
      $config = collect(config($config_key));
      $config = $config->replaceRecursive(include $module_file)->toArray();
      config([ $config_key => $config ]);
      return $config;
    }

    public function registerModules($modules = [])
    {
      foreach($modules as $module) {
        $this->app->register($module);
      }
    }

    public function bootControllers($controllers = [])
    {
      foreach($controllers as $controller) {
        $call = [$controller, 'registerRoutes'];
        if (!is_callable($call)) continue;
        call_user_func($call);
      }
    }

    public function registerSchema($file)
    {
      $schema = include $file;
      $database_schema = config('app_database_schema', []);
      $database_schema = array_merge($database_schema, $schema);
      config(['app_database_schema' => $database_schema]);
    }
}
