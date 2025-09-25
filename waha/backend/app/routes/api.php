<?php

/**
 * FILE AUTOMATICALLY GENERATED, DO NOT EDIT!!
 * To generate this file content, edit controllers
 * at Http/Controllers then run "php artisan app:openapi".
 * File generated at 2025-09-25 18:14:28
 */

use Illuminate\Support\Facades\Route;

Route::match(['get'], '/', App\Http\Controllers\ApiSwaggerController::class)->name('ApiSwaggerController')->middleware([]);
Route::match(['get'], 'app/load', App\Http\Controllers\AppLoadGetController::class)->name('AppLoadGetController')->middleware([]);
Route::match(['get'], 'app/test', App\Http\Controllers\AppTestGetController::class)->name('AppTestGetController')->middleware([]);
Route::match(['post'], 'auth/login', App\Http\Controllers\AuthLoginPostController::class)->name('AuthLoginPostController')->middleware([]);
Route::match(['post'], 'auth/password', App\Http\Controllers\AuthPasswordPostController::class)->name('AuthPasswordPostController')->middleware([]);
Route::match(['post'], 'auth/register', App\Http\Controllers\AuthRegisterPostController::class)->name('AuthRegisterPostController')->middleware([]);
Route::match(['post'], 'waha/webhook', App\Http\Controllers\WahaWebhookPostController::class)->name('WahaWebhookPostController')->middleware([]);
