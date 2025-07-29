<?php

return [
	'serviceProviders' => [
		\Modules\Resume\ResumeServiceProvider::class,
		\Modules\Ticket\TicketServiceProvider::class,
	],
	'commands' => [
		\Modules\Resume\Console\Commands\ResumeTestCommand::class
	],
];
