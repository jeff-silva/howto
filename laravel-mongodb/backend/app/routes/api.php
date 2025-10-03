<?php

use App\Models\ShopProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::get('/test', function (Request $request) {
    $scope = new \stdClass;

    // $scope->product = ShopProduct::create([
    //     'name' => 'Caderno',
    //     'price' => 15.90,
    // ]);

    $scope->productList = ShopProduct::all();

    dump($scope);
});
