<?php

namespace App\Base;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Arr;

class ServiceProviderBase extends ServiceProvider
{
    public function mergeConfigDeep($module_file, $config_key)
    {
      $config = collect(config($config_key));
      $config = $config->replaceRecursive(include $module_file)->toArray();
      config([ $config_key => $config ]);
      return $config;
    }
}
