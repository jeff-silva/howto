<?php

namespace Modules\Resume\Models;

use \App\Traits\ModelSearchTrait;
use Illuminate\Database\Eloquent\Model;

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
