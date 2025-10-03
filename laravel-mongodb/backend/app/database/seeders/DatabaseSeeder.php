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

        $scope = new \stdClass;

        $scope->userAdmin = AppUser::firstOrCreate(['id' => 1], [
            'name' => 'main@grr.la',
            'email' => 'main@grr.la',
            'password' => 'main@grr.la',
        ]);

        $scope->shopCategoryList = [];

        $scope->shopCategoryList[] = ShopCategory::firstOrCreate(['slug' => 'cama-mesa-banho'], [
            'name' => 'Cama, Mesa e Banho',
        ]);

        $scope->shopCategoryList[] = ShopCategory::firstOrCreate(['slug' => 'eletronico'], [
            'name' => 'Eletrônicos',
        ]);

        $scope->shopCategoryList[] = ShopCategory::firstOrCreate(['slug' => 'alimento'], [
            'name' => 'Alimentos',
        ]);

        $scope->shopCategoryList[] = ShopCategory::firstOrCreate(['slug' => 'telefone-celular'], [
            'name' => 'Telefones Celulares',
        ]);

        $scope->shopProductList = [];

        $scope->shopCategoryList[] = ShopProduct::firstOrCreate(['slug' => 'lencol-frenesi'], [])->update([
            'name' => 'Lençol Frenesi Casal',
            'price' => 129.90,
            'shop_category_ids' => [
                new ObjectId($scope->shopCategoryList[0]['_id']),
            ],
        ]);

        $scope->shopCategoryList[] = ShopProduct::firstOrCreate(['slug' => 'celular-xiamoi'], [])->update([
            'name' => 'Celular Xiaomi S25 Ultra Pro',
            'price' => 2999.90,
            'shop_category_ids' => [
                new ObjectId($scope->shopCategoryList[1]['_id']),
                new ObjectId($scope->shopCategoryList[3]['_id']),
            ],
        ]);

        dump($scope);
    }
}
