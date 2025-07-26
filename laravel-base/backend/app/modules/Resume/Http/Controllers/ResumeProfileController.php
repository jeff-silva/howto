<?php

namespace Modules\Resume\Http\Controllers;

use Illuminate\Http\Request;
use Modules\Resume\Models\ResumeProfile;
use App\Attributes\Route;
use App\Http\Controllers\Controller;
use App\Http\Requests\AppUserStoreRequest;
use App\Http\Requests\AppUserUpdateRequest;

class ResumeProfileController extends Controller
{
    #[Route(path: '/api/resume_profile', methods: ['post'], middleware: ['auth:sanctum'], name: 'resume_profile.create')]
    public function create(AppUserStoreRequest $request)
    {
        $entity = ResumeProfile::create($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/resume_profile/:id', methods: ['put'], middleware: ['auth:sanctum'], name: 'resume_profile.update')]
    public function update(AppUserUpdateRequest $request, ResumeProfile $entity)
    {
        $entity->update($request->validated());
        return compact(['entity']);
    }

    #[Route(path: '/api/resume_profile', methods: ['get'], middleware: ['auth:sanctum'], name: 'resume_profile.index')]
    public function index(Request $request)
    {
        return ResumeProfile::searchPaginated($request->all());
    }

    #[Route(path: '/api/resume_profile/:id', methods: ['get'], middleware: ['auth:sanctum'], name: 'resume_profile.select')]
    public function select(ResumeProfile $entity)
    {
        return compact(['entity']);
    }

    #[Route(path: '/api/resume_profile/:id', methods: ['delete'], middleware: ['auth:sanctum'], name: 'resume_profile.delete')]
    public function delete(ResumeProfile $entity)
    {
        $entity->delete();
        return compact(['entity']);
    }
}
