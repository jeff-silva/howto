<?php

use App\Http\Controllers\Controller;
use App\Models\AppUser;
use App\Models\CineCast;
use App\Models\CineMovie;
use App\Models\CineMovieCast;
use App\Models\ShopCategory;
use App\Models\ShopProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use MongoDB\BSON\ObjectId;

// opcache_reset();
// clearstatcache(true);

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Controller::register(App\Http\Controllers\CineCastCreateController::class);
Controller::register(App\Http\Controllers\CineCastDeleteController::class);
Controller::register(App\Http\Controllers\CineCastUpdateController::class);
Controller::register(App\Http\Controllers\CineMovieCastCreateController::class);
Controller::register(App\Http\Controllers\CineMovieCastDeleteController::class);
Controller::register(App\Http\Controllers\CineMovieCastUpdateController::class);
Controller::register(App\Http\Controllers\CineMovieCreateController::class);
Controller::register(App\Http\Controllers\CineMovieDeleteController::class);
Controller::register(App\Http\Controllers\CineMovieUpdateController::class);

Route::get('/test', function (Request $request) {
    // return phpinfo();

    $scope = new \stdClass;

    AppUser::upsert([
        [
            'name' => 'main@grr.la',
            'email' => 'main@grr.la',
            'password' => Hash::make('main@grr.la'),
        ],
    ], ['email'], ['name']);

    $scope->cine_user_list = AppUser::query()->get()->toArray();

    // ShopCategory::upsert([
    //     [
    //         'slug' => 'cama-mesa-banho',
    //         'name' => 'Cama, Mesa e Banho',
    //     ],
    //     [
    //         'slug' => 'eletronico',
    //         'name' => 'Eletrônicos',
    //     ],
    //     [
    //         'slug' => 'alimento',
    //         'name' => 'Alimentos',
    //     ],
    //     [
    //         'slug' => 'telefone-celular',
    //         'name' => 'Telefones Celulares',
    //     ],
    // ], 'slug');

    // $scope->shop_category_list = ShopCategory::query()->get()->toArray();

    // ShopProduct::upsert([
    //     [
    //         'slug' => 'lencol-frenesi',
    //         'name' => 'Lençol Frenesi Casal',
    //         'price' => 129.90,
    //         'shop_category_ids' => [
    //             $scope->shop_category_list[0]['id'],
    //         ],
    //     ],
    //     [
    //         'slug' => 'celular-xiamoi',
    //         'name' => 'Celular Xiaomi S25 Ultra Pro',
    //         'price' => 2999.90,
    //         'shop_category_ids' => [
    //             $scope->shop_category_list[1]['id'],
    //             $scope->shop_category_list[3]['id'],
    //         ],
    //     ],
    // ], 'slug');

    // $scope->shop_product_list = ShopProduct::query()->get()->toArray();

    // $scope->shopProductRelationList = ShopProduct::query()
    //     ->aggregate()->lookup(
    //         from: 'shop_category',
    //         localField: 'shop_category_ids',
    //         foreignField: '_id',
    //         as: 'categories',
    //     )
    //     ->get()
    //     ->toArray();

    CineCast::upsert([
        [
            'slug' => 'tom-hanks',
            'name' => 'Tom Hanks',
        ],
        [
            'slug' => 'quentin-tarantino',
            'name' => 'Quentin Tarantino',
        ],
        [
            'slug' => 'brad-pitt',
            'name' => 'Brad Pitt',
        ],
    ], 'slug');

    $scope->cine_cast_list = CineCast::query()
        ->with([
            'cine_movie_list',
            'cine_movie_list.cine_cast',
            'cine_movie_list.cine_movie',
        ])
        ->get()->toArray();

    CineMovie::upsert([
        [
            'slug' => 'resgate-do-soldado-ryan',
            'name' => 'O Resgate do Soldado Rian',
        ],
        [
            'slug' => 'o-naufrago',
            'name' => 'O Náufrago',
        ],
        [
            'slug' => 'pulp-fiction',
            'name' => 'Pulp Fiction',
        ],
        [
            'slug' => 'fight-club',
            'name' => 'Clube da Luta',
        ],
        [
            'slug' => 'once-upon-a-time-in-hollywood',
            'name' => 'Era Uma Vez em Hollywood',
        ],
    ], 'slug');

    $scope->cine_movie_list = CineMovie::query()
        ->with([
            'cine_movie_cast',
            'cine_movie_cast.cine_cast',
            'cine_movie_cast.cine_movie',
        ])
        ->get()->toArray();

    CineMovieCast::upsert([
        [
            'name' => 'Ator',
            'cine_cast_id' => $scope->cine_cast_list[0]['id'],
            'cine_movie_id' => $scope->cine_movie_list[0]['id'],
        ],
        [
            'name' => 'Ator',
            'cine_cast_id' => $scope->cine_cast_list[0]['id'],
            'cine_movie_id' => $scope->cine_movie_list[1]['id'],
        ],
        [
            'name' => 'Diretor',
            'cine_cast_id' => $scope->cine_cast_list[1]['id'],
            'cine_movie_id' => $scope->cine_movie_list[2]['id'],
        ],
        [
            'name' => 'Ator',
            'cine_cast_id' => $scope->cine_cast_list[1]['id'],
            'cine_movie_id' => $scope->cine_movie_list[2]['id'],
        ],
        [
            'name' => 'Ator',
            'cine_cast_id' => $scope->cine_cast_list[2]['id'],
            'cine_movie_id' => $scope->cine_movie_list[3]['id'],
        ],
        [
            'name' => 'Diretor',
            'cine_cast_id' => $scope->cine_cast_list[1]['id'],
            'cine_movie_id' => $scope->cine_movie_list[4]['id'],
        ],
        [
            'name' => 'Ator',
            'cine_cast_id' => $scope->cine_cast_list[2]['id'],
            'cine_movie_id' => $scope->cine_movie_list[4]['id'],
        ],
    ], ['name', 'cine_cast_id', 'cine_movie_id']);

    $scope->cine_movie_cast = CineMovieCast::query()->with(['cine_cast', 'cine_movie'])->get()->toArray();

    echo "<pre>Cast:</pre>";
    foreach ($scope->cine_cast_list as $cine_cast) {
        echo "<pre>  <strong>{$cine_cast['name']}</strong> trabalhou nos filmes:</pre>";
        foreach ($cine_cast['cine_movie_list'] as $cine_movie) {
            echo "<pre>  - <strong>{$cine_movie['cine_movie']['name']}</strong> como <strong>{$cine_movie['name']}</strong>;</pre>";
        }
    }

    echo "<pre>Filmes:</pre>";
    foreach ($scope->cine_movie_list as $cine_movie) {
        echo "<pre>  A equipe do filme <strong>{$cine_movie['name']}</strong> foi composta por:</pre>";
        foreach ($cine_movie['cine_movie_cast'] as $cine_movie_cast) {
            echo "<pre>  - <strong>{$cine_movie_cast['cine_cast']['name']}</strong> como <strong>{$cine_movie_cast['name']}</strong>;</pre>";
        }
    }

    // echo '<pre>' . print_r($scope, true) . '</pre>';
    // dump($scope);
});
