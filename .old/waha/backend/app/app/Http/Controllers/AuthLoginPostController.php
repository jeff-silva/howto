<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthLoginPostController extends Controller
{
    public $methods = ['post'];
    public $route = 'auth/login';

    public function __invoke(Request $request)
    {
        $all = $request->all();
        return compact(['all']);
    }

    public function openapi()
    {
        return [
            'tags' => ['auth'],
        ];
    }

    public function openapiParams()
    {
        return [
            [
                'in' => 'body',
                'name' => 'email',
                'description' => 'E-mail',
                'example' => 'user@mail.com',
            ],
            [
                'in' => 'body',
                'name' => 'password',
                'description' => 'Senha',
                'example' => '12345',
            ],
        ];
    }
}
