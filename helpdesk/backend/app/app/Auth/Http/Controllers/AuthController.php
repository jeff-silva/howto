<?php

namespace App\Auth\Http\Controllers;

use \App\Auth\Models\AppUser;
use \App\Attributes\Route;
use Illuminate\Http\Request;
use \App\Http\Controllers\Controller;
use \Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    #[Route(path: '/api/auth/login', methods: ['post'], name: 'auth.login')]
    public function login(Request $request)
    {
        $user = AppUser::query()
            ->where('email', $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciais inválidas.'
            ], 401);
        }

        $token = $user->createToken('main');
        return compact(['token']);
    }
}
