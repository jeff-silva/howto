<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ShopProduct extends Model
{
    protected $table = 'shop_product';
    protected $fillable = ['slug', 'name', 'price', 'category_ids'];

    protected $casts = [
        'category_ids' => 'array',
    ];
}
