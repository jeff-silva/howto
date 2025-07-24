<?php

namespace App\Modules\Auth\Http\Controllers;

use \App\Attributes\Route;
use Illuminate\Http\Request;
use \App\Modules\Auth\Models\AppUser;
use \App\Http\Controllers\Controller;
use \App\Modules\Auth\Http\Requests\AppUserStoreRequest;
use \App\Modules\Auth\Http\Requests\AppUserUpdateRequest;

class AppUserController extends Controller
{
    #[Route(path: '/api/app_user', methods: ['post'], middleware: ['auth:sanctum'], name: 'app_user.create')]
    public function create(AppUserStoreRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/app_user/:id', methods: ['put'], middleware: ['auth:sanctum'], name: 'app_user.update')]
    public function update(AppUserUpdateRequest $request, AppUser $entity)
    {
        $entity->update($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/app_user', methods: ['get'], middleware: ['auth:sanctum'], name: 'app_user.index')]
    public function index(Request $request)
    {
        $data = AppUser::searchPaginated($request->all());
        return compact(['data']);
    }

    #[Route(path: '/api/app_user/:id', methods: ['get'], middleware: ['auth:sanctum'], name: 'app_user.select')]
    public function select(AppUser $entity)
    {
        return compact(['entity']);
    }

    #[Route(path: '/api/app_user/:id', methods: ['delete'], middleware: ['auth:sanctum'], name: 'app_user.delete')]
    public function delete(AppUser $entity)
    {
        $entity->delete();
        return compact(['entity']);
    }
}
