<?php

if (defined('LARAVEL_HELPERS')) return;
define('LARAVEL_HELPERS', __FILE__);

use Illuminate\Support\Facades\File;

class LogHelper
{
  static function put($data, $file = null)
  {
    $file = $file ?? 'laravel.log';
    $file = storage_path("/logs/{$file}");
    if (!is_numeric($data) and !is_string($data)) {
      $data = json_encode($data, JSON_PRETTY_PRINT);
    }
    File::put($file, $data . "\n");
  }

  static function append($data, $file = null)
  {
    $file = $file ?? 'laravel.log';
    $file = storage_path("/logs/{$file}");
    if (!is_numeric($data) and !is_string($data)) {
      $data = json_encode($data, JSON_PRETTY_PRINT);
    }
    File::append($file, $data . "\n");
  }

  static function prepend($data, $file = null)
  {
    $file = $file ?? 'laravel.log';
    $file = storage_path("/logs/{$file}");
    if (!is_numeric($data) and !is_string($data)) {
      $data = json_encode($data, JSON_PRETTY_PRINT);
    }
    File::prepend($file, $data . "\n");
  }
}
