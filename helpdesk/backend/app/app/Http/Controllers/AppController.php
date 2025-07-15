<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Attributes\Route;
use \App\Models\AppUser;
use \Illuminate\Support\Facades\Hash;

class AppController extends Controller
{
    #[Route(path: '/app/load', methods: ['get'], name: 'app.load')]
    public function load(Request $request)
    {
        $token = $request->bearerToken();
        $user = auth()->guard('sanctum')->user();
        return compact(['user']);
    }
}
