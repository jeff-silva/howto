<?php

\App\Http\Controllers\Controller::apis([
    \App\Http\Controllers\App\AppLoadController::class,

    \App\Http\Controllers\Mdb\MdbMovieSelectController::class,
    \App\Http\Controllers\Mdb\MdbMovieSearchController::class,
    \App\Http\Controllers\Mdb\MdbMovieUpsertController::class,
]);
