<?php

namespace App\Http\Controllers;

use App\Models\AppUser;
use Illuminate\Http\Request;
use Modular\Attributes\Route;
use App\Http\Controllers\Controller;
use App\Http\Requests\AppUserRequest;

class AppUserController extends Controller
{
    #[Route(
        path: '/api/app_user',
        methods: ['post'],
        middleware: ['auth:sanctum'],
        name: 'app_user.create',
    )]
    public function create(AppUserRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }

    #[Route(
        path: '/api/app_user/{id}',
        methods: ['put'],
        middleware: ['auth:sanctum'],
        name: 'app_user.update',
        params: [
            'id' => ['in' => 'path', 'required' => true],
        ],
    )]
    public function update(AppUserRequest $request, $id)
    {
        $entity = AppUser::find($id);
        $entity->update($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/app_user', methods: ['get'], middleware: ['auth:sanctum'], name: 'app_user.index')]
    public function index(Request $request)
    {
        return AppUser::searchPaginated($request->all());
    }

    #[Route(
        path: '/api/app_user/{id}',
        methods: ['get'],
        middleware: ['auth:sanctum'],
        name: 'app_user.select',
        params: [
            'id' => ['in' => 'path', 'required' => true],
        ],
    )]
    public function select($id)
    {
        $entity = AppUser::find($id);
        return compact(['entity']);
    }

    #[Route(
        path: '/api/app_user/{id}',
        methods: ['delete'],
        middleware: ['auth:sanctum'],
        name: 'app_user.delete',
        params: [
            'id' => ['in' => 'path', 'required' => true],
        ],
    )]
    public function delete(AppUser $entity)
    {
        $entity->delete();
        return compact(['entity']);
    }
}
