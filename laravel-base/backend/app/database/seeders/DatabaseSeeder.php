<?php

namespace Database\Seeders;

use App\Auth\Models\AppUser;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $user = AppUser::firstOrNew(['id' => 1], [
            'name' => 'Root',
            'email' => 'main@grr.la',
            'password' => 'main@grr.la',
        ]);

        $user->save();
    }
}
