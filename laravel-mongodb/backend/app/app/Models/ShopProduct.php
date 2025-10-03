<?php

namespace App\Models;

use MongoDB\BSON\ObjectId;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ShopProduct extends Model
{
    protected $table = 'shop_product';
    protected $fillable = ['slug', 'name', 'price', 'shop_category_ids'];

    // protected $casts = [
    //     '_id' => 'string',
    //     // 'shop_category_ids' => 'array',
    //     'created_at' => 'datetime',
    //     'updated_at' => 'datetime',
    // ];

    protected function shopCategoryIds(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                return array_map(function ($id) {
                    if (!is_string($id)) return $id;
                    return  new ObjectId($id);
                }, $value);
            },
            get: function ($value) {
                return array_map(function ($id) {
                    if (is_string($id)) return $id;
                    $data = json_decode(json_encode($id), true);
                    return $data['$oid'];
                }, $value);
            },
        );
    }

    public function shop_category_list()
    {
        // return $this->embedsMany(ShopCategory::class);
        // return $this->hasMany(ShopCategory::class);
        // return $this->hasMany(ShopCategory::class, 'shop_category_ids', '_id');
        // return $this->hasMany(ShopCategory::class, '_id', 'shop_category_ids');
        // return $this->belongsToMany(ShopCategory::class);

        // return $this->hasMany(ShopCategory::class, '_id', 'shop_category_ids')
        return $this->hasMany(ShopCategory::class, 'shop_category_ids', '_id')
            ->whereIn('_id', $this->shop_category_ids);
    }
}
