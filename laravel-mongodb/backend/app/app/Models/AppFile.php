<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class AppFile extends Model
{
    protected $table = 'app_file';
    protected $fillable = ['name', 'md5', 'mime', 'size', 'folder', 'ref'];

    // protected function casts(): array
    // {
    //     return [
    //         'password' => 'hashed',
    //     ];
    // }
}
