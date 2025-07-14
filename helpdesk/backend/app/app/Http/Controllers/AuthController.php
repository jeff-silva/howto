<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Attributes\Route;

class AuthController extends Controller
{
    #[Route(path: '/auth/login', methods: ['post'], name: 'auth.login')]
    public function create()
    {
        return [123];
    }
}
