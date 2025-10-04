<?php

namespace App\Models;

use Illuminate\Support\Str;
use MongoDB\Laravel\Eloquent\Model;

class CineCast extends Model
{
    protected $table = 'cine_cast';
    protected $fillable = ['slug', 'name'];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (empty($model->slug) && !empty($model->name)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    public function cine_movie_list()
    {
        return $this->hasMany(CineMovieCast::class, 'cine_cast_id', '_id');
    }
}
