<?php

namespace App\Http\Controllers\App;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Http\Controllers\Controller;

#[OA\Info(title: "OpenAPI", version: "1.0.0")]

#[OA\Get(
    path: '/app/load',
    operationId: 'app.load',
    tags: ['App'],
    responses: [
        new OA\Response(response: 200, description: 'Resultado')
    ]
)]

class AppLoadController extends Controller
{
    public function __invoke(Request $request)
    {
        return response()->json(['message' => 'sucesso']);
    }
}
