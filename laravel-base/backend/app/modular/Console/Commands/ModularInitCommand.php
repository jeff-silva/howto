<?php

namespace Modular\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ModularInitCommand extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'modular:init';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Modular Init';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $files = \Illuminate\Support\Facades\File::allFiles(base_path('/modules'));

    $sections = [
      'serviceProviders' => 'ServiceProvider.php',
      'commands' => 'Command.php',
      'controllers' => 'Controller.php',
    ];

    $content = [
      '<?php',
      '',
      '/*',
      ' * File generated automatically, do not edit!',
      ' * Run "php artisan modular:init" to generate this file.',
      '*/',
      '',
      'return ['
    ];

    foreach ($sections as $sectionName => $sectionSuffix) {
      $content[] = "";
      $content[] = "\t'{$sectionName}' => [";
      foreach ($files as $file) {
        if (!Str::endsWith($file, $sectionSuffix)) continue;
        $class = $file->getFilenameWithoutExtension() . '::class';
        $class = $file->getRelativePath() . '/' . $class;
        $class = '\Modules\\' . str_replace('/', '\\', $class) . ',';
        $content[] = "\t\t{$class}";
      }
      $content[] = "\t],";
    }

    $content[] = '];';
    $content[] = '';

    file_put_contents(
      filename: base_path('/modular/modules.php'),
      data: join("\n", $content)
    );
  }
}
