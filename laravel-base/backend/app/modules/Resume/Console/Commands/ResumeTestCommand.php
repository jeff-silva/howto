<?php

namespace Modules\Resume\Console\Commands;

use Illuminate\Console\Command;

class ResumeTestCommand extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'resume:test';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Resume test';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    dump('test');
  }
}
