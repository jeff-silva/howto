<?php

namespace App\Http\Controllers;

use App\Models\AppUser;
use Illuminate\Http\Request;
use Modular\Attributes\Route;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\AuthRegisterRequest;

class AuthController extends Controller
{
    #[Route([
        'path' => '/api/auth/login',
        'methods' => ['post'],
        'name' => 'auth.login',
        'params' => [
            'email' => ['in' => 'body'],
            'password' => ['in' => 'body'],
        ],
    ])]
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

    #[Route([
        'path' => '/api/auth/register',
        'methods' => ['post'],
        'name' => 'auth.register',
    ])]
    public function register(AuthRegisterRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }

    #[Route([
        'path' => '/api/auth/password/request',
        'methods' => ['post'],
        'name' => 'auth.password.request',
    ])]
    public function passwordRequest(AuthRegisterRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }

    #[Route([
        'path' => '/api/auth/password/update',
        'methods' => ['post'],
        'name' => 'auth.password.update',
    ])]
    public function passwordUpdate(AuthRegisterRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }
}
