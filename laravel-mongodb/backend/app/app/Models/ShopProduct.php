<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

class ShopProduct extends Model
{
    protected $table = 'shop_product';
    protected $fillable = ['slug', 'name', 'price', 'shop_category_ids'];

    protected $casts = [
        'shop_category_ids' => 'array',
    ];

    public function shop_category_list()
    {
        // return $this->hasMany(ShopCategory::class);
        // return $this->embedsMany(ShopCategory::class);
        // return $this->hasMany(ShopCategory::class, 'shop_category_ids', '_id');
        return $this->hasMany(ShopCategory::class, '_id', 'shop_category_ids');
    }
}
