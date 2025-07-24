<?php

namespace App\Modules\Auth\Http\Controllers;

use \App\Modules\Auth\Models\AppUser;
use \App\Attributes\Route;
use Illuminate\Http\Request;
use \App\Http\Controllers\Controller;
use \Illuminate\Support\Facades\Hash;
use \App\Modules\Auth\Http\Requests\AuthRegisterRequest;

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

    #[Route(path: '/api/auth/register', methods: ['post'], name: 'auth.register')]
    public function register(AuthRegisterRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/auth/password/request', methods: ['post'], name: 'auth.password.request')]
    public function passwordRequest(AuthRegisterRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/auth/password/update', methods: ['post'], name: 'auth.password.update')]
    public function passwordUpdate(AuthRegisterRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }
}
