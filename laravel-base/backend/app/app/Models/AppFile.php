<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Modular\Traits\ModelSearchTrait;

class AppFile extends Model
{
    use ModelSearchTrait;

    protected $table = 'app_file';

    protected $fillable = [
        'name',
    ];
}
