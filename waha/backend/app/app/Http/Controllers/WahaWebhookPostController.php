<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WahaWebhookPostController extends Controller
{
    public $openapi = false;
    public $method = 'post';
    public $route = 'waha/webhook';

    public function __invoke(Request $request)
    {
        $all = $request->all();
        // file_put_contents(public_path('webhook.json'), json_encode($all, JSON_PRETTY_PRINT));
        return compact(['all']);
    }

    public function openapi()
    {
        return [
            'tags' => ['waha'],
        ];
    }
}
