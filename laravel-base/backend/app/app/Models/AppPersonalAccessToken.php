<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken;

class AppPersonalAccessToken extends PersonalAccessToken
{
    protected $table = 'app_personal_access_token';
}
