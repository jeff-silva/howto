<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Modular\Attributes\Route;
use App\Http\Controllers\Controller;

class AppController extends Controller
{
    #[Route(path: '/api/app/load', methods: ['get'], name: 'app.load')]
    public function load(Request $request)
    {
        $token = $request->bearerToken();
        $user = auth()->guard('sanctum')->user();
        $config = config('app_config.public');
        return compact(['user', 'config']);
    }

    #[Route(path: '/api/app/openapi', methods: ['get'], name: 'app.openapi')]
    public function openapi(Request $request)
    {
        return app()->make('modular')->getOpenapi();
    }
}
