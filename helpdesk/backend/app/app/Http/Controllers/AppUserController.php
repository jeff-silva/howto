<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Attributes\Route;

class AppUserController extends Controller
{
    #[Route(path: '/app_user', methods: ['post'], name: 'app_user.create')]
    public function create()
    {
        return [123];
    }

    #[Route(path: '/app_user/:id', methods: ['put'], name: 'app_user.update')]
    public function update()
    {
        return [123];
    }

    #[Route(path: '/app_user', methods: ['get'], name: 'app_user.index')]
    public function index()
    {
        return [123];
    }

    #[Route(path: '/app_user/:id', methods: ['get'], name: 'app_user.select')]
    public function select()
    {
        return [123];
    }

    #[Route(path: '/app_user/:id', methods: ['delete'], name: 'app_user.delete')]
    public function delete()
    {
        return [123];
    }
}
