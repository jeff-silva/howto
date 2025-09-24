<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('app/test', App\Http\Controllers\AppTestGetController::class)->name('AppTestGetController');