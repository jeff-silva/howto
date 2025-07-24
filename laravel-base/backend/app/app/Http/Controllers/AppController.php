<?php

namespace App\Http\Controllers;

use \App\Attributes\Route;
use Illuminate\Http\Request;
use \App\Http\Controllers\Controller;

class AppController extends Controller
{
    #[Route(path: '/api/app/load', methods: ['get'], name: 'app.load')]
    public function load(Request $request)
    {
        $token = $request->bearerToken();
        $user = auth()->guard('sanctum')->user();
        return compact(['user']);
    }
}
