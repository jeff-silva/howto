<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CineMovie extends Model
{
    protected $table = 'cine_movie';
    protected $fillable = ['slug', 'name'];

    public function cine_movie_cast()
    {
        return $this->hasMany(CineMovieCast::class, 'cine_movie_id', '_id');
    }
}
