<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AppInitCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Inicializa aplicação';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('optimize');
        $this->call('migrate');
        $this->call('db:seed');
    }
}
