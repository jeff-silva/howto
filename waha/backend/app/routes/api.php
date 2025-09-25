<?php

/**
 * FILE AUTOMATICALLY GENERATED, DO NOT EDIT!!
 * To generate this file content, edit controllers
 * at Http/Controllers then run "php artisan app:openapi".
 * File generated at 2025-09-25 04:45:23
 */

use Illuminate\Support\Facades\Route;

Route::get('/', App\Http\Controllers\ApiSwaggerController::class)->name('ApiSwaggerController')->middleware([]);
Route::get('app/test', App\Http\Controllers\AppTestGetController::class)->name('AppTestGetController')->middleware([]);
Route::post('auth/login', App\Http\Controllers\AuthLoginPostController::class)->name('AuthLoginPostController')->middleware([]);
Route::post('auth/password', App\Http\Controllers\AuthPasswordPostController::class)->name('AuthPasswordPostController')->middleware([]);
Route::post('auth/register', App\Http\Controllers\AuthRegisterPostController::class)->name('AuthRegisterPostController')->middleware([]);
Route::post('waha/webhook', App\Http\Controllers\WahaWebhookPostController::class)->name('WahaWebhookPostController')->middleware([]);
