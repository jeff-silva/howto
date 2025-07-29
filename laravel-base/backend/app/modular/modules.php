<?php

/*
 * File generated automatically, do not edit!
 * Run "php artisan modular:init" to generate this file.
*/

return [
	'serviceProviders' => [
		\Modules\Resume\ResumeServiceProvider::class,
		\Modules\Ticket\TicketServiceProvider::class,
	],

	'commands' => [
		\Modules\Resume\Console\Commands\ResumeTestCommand::class,
	],

	'controllers' => [
		\Modules\Resume\Http\Controllers\ResumeProfileController::class,
		\Modules\Ticket\Http\Controllers\TicketTaskController::class,
	],

];
