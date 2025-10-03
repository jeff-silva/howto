<?php

namespace Database\Seeders;

use App\Models\AppUser;
use App\Models\ShopCategory;
use App\Models\ShopProduct;
use MongoDB\BSON\ObjectId;
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
    }
}
