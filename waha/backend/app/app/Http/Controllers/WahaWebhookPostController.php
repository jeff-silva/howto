<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WahaWebhookPostController extends Controller
{
    public $method = 'post';
    public $route = 'waha/webhook';

    public function __invoke(Request $request)
    {
        $all = $request->all();
        // dump($all);
        return compact(['all']);
    }

    public function openapi()
    {
        return [
            'tags' => ['waha'],
        ];
    }
}
