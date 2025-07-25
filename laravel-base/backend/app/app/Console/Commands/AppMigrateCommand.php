<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class AppMigrateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $this->dropTables();
        
        $app_database_schema = config('app_database_schema', []);

        // Create tables that not exists
        foreach($app_database_schema as $table_name => $table_data) {
            if (Schema::hasTable($table_name)) continue;
            dump('create');
            Schema::create($table_name, function(Blueprint $table) use($table_data) {
                foreach($table_data['fields'] as $field_name => $field_call) {
                    call_user_func($field_call, $table);
                }
            });
        }

        // // Update tables if needed
        // foreach($app_database_schema as $table_name => $table_data) {
        //     Schema::table($table_name, function(Blueprint $table) use($table_name, $table_data) {
        //         foreach($table_data['fields'] as $field_name => $field_call) {
        //             try {
        //                 if (Schema::hasColumn($table_name, $field_name)) {
        //                     call_user_func($field_call, $table)->change();
        //                 } else {
        //                     call_user_func($field_call, $table);
        //                 }
        //             } catch (\Exception $e) {
        //                 dump($e);
        //             }
                    
        //             dump("{$table_name}.{$field_name}");
        //         }
        //     });
        // }
    }

    public function dropTables()
    {
        $tables = collect(DB::select('SHOW TABLES'))->pluck('Tables_in_app');
        foreach($tables as $table) Schema::dropIfExists($table);
    }
}
