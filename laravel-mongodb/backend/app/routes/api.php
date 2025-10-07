<?php

App\Http\Controllers\Controller::register([
    App\Http\Controllers\AppFileCreateController::class,
    App\Http\Controllers\CineCastCreateController::class,
    App\Http\Controllers\CineCastDeleteController::class,
    App\Http\Controllers\CineCastUpdateController::class,
    App\Http\Controllers\CineMovieCastCreateController::class,
    App\Http\Controllers\CineMovieCastDeleteController::class,
    App\Http\Controllers\CineMovieCastUpdateController::class,
    App\Http\Controllers\CineMovieCreateController::class,
    App\Http\Controllers\CineMovieDeleteController::class,
    App\Http\Controllers\CineMovieUpdateController::class,
]);
