<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('app/test', App\Http\Controllers\AppTestGetController::class)->name('AppTestGetController');
Route::post('auth/login', App\Http\Controllers\AuthLoginPostController::class)->name('AuthLoginPostController');
Route::post('waha/webhook', App\Http\Controllers\WahaWebhookPostController::class)->name('WahaWebhookPostController');
