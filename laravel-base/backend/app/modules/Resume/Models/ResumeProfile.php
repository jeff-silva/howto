<?php

namespace Modules\Resume\Models;

use Illuminate\Database\Eloquent\Model;
use Modular\Traits\ModelSearchTrait;

class ResumeProfile extends Model
{
    use ModelSearchTrait;

    protected $table = 'resume_profile';
    protected $fillable = [
        'name',
        'resume',
    ];
    protected $casts = [
        'resume' => 'json',
    ];
}
