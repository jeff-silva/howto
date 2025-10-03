<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ShopProduct extends Model
{
    protected $collection = 'shop_product';
    protected $fillable = ['name', 'price'];
}
