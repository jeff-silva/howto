<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApiSwaggerController extends Controller
{
    public $openapi = false;
    public $methods = ['get'];
    public $route = '/';

    public function __invoke(Request $request)
    {
        echo file_get_contents(public_path('swagger.html'));
    }
}
