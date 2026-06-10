<?php

namespace App\Listeners;

use App\Services\RabbitMQService;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class RabbitMQListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        dump('RabbitMQListener:handle');
        $amqp = new RabbitMQService();

        $amqp->onReceive('random', function($msg) {
            dump('random:', $msg);
        });
    }
}
