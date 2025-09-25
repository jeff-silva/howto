<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthPasswordPostController extends Controller
{
    public $methods = ['post'];
    public $route = 'auth/password';

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
                'name' => 'code',
                'description' => 'Código recebido por e-mail',
                'example' => '12345',
            ],
            [
                'in' => 'body',
                'name' => 'password',
                'description' => 'Nova senha',
                'example' => '12345',
            ],
        ];
    }
}
