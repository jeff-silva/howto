<?php

namespace App\Models;

use \App\Traits\ModelSearchTrait;

class AppFile extends Authenticatable
{
    use ModelSearchTrait;

    protected $table = 'app_file';

    protected $fillable = [
        'name',
    ];
}
