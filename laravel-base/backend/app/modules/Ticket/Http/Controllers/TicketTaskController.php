<?php

namespace Modules\Ticket\Http\Controllers;

use App\Attributes\Route;
use Illuminate\Http\Request;
use Modules\Auth\Models\AppUser;
use \App\Http\Controllers\Controller;
use Modules\Auth\Http\Requests\AppUserStoreRequest;
use Modules\Auth\Http\Requests\AppUserUpdateRequest;

class TicketTaskController extends Controller
{
    #[Route(path: '/api/ticket_task', methods: ['post'], middleware: ['auth:sanctum'], name: 'ticket_task.create')]
    public function create(AppUserStoreRequest $request)
    {
        $entity = AppUser::create($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/ticket_task/:id', methods: ['put'], middleware: ['auth:sanctum'], name: 'ticket_task.update')]
    public function update(AppUserUpdateRequest $request, AppUser $entity)
    {
        $entity->update($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/ticket_task', methods: ['get'], middleware: ['auth:sanctum'], name: 'ticket_task.index')]
    public function index(Request $request)
    {
        $data = AppUser::searchPaginated($request->all());
        return compact(['data']);
    }

    #[Route(path: '/api/ticket_task/:id', methods: ['get'], middleware: ['auth:sanctum'], name: 'ticket_task.select')]
    public function select(AppUser $entity)
    {
        return compact(['entity']);
    }

    #[Route(path: '/api/ticket_task/:id', methods: ['delete'], middleware: ['auth:sanctum'], name: 'ticket_task.delete')]
    public function delete(AppUser $entity)
    {
        $entity->delete();
        return compact(['entity']);
    }
}
