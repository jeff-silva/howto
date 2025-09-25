<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', App\Http\Controllers\ApiSwaggerController::class)->name('ApiSwaggerController')->middleware([]);
Route::get('app/test', App\Http\Controllers\AppTestGetController::class)->name('AppTestGetController')->middleware([]);
Route::post('auth/login', App\Http\Controllers\AuthLoginPostController::class)->name('AuthLoginPostController')->middleware([]);
Route::post('waha/webhook', App\Http\Controllers\WahaWebhookPostController::class)->name('WahaWebhookPostController')->middleware([]);
