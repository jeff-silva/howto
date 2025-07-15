<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Attributes\Route;
use \App\Models\AppUser;
use \Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    #[Route(path: '/auth/login', methods: ['post'], name: 'auth.login')]
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
