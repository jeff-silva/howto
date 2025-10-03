<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ShopCategory extends Model
{
    protected $table = 'shop_category';
    protected $fillable = ['slug', 'name'];
}
