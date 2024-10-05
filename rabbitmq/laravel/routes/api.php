<?php

use Illuminate\Http\Request;
use App\Services\RabbitMQService;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RabbitMQController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('rabbitmq/send', [RabbitMQController::class, 'send']);
