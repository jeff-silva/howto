<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CineMovieCast extends Model
{
    protected $table = 'cine_movie_cast';
    protected $fillable = ['name', 'cine_cast_id', 'cine_movie_id'];

    public function cine_cast()
    {
        return $this->hasOne(CineCast::class, '_id', 'cine_cast_id');
    }

    public function cine_movie()
    {
        return $this->hasOne(CineMovie::class, '_id', 'cine_movie_id');
    }
}
