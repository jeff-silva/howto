<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\RabbitMQService;

class RabbitMQController extends Controller
{
    public function __construct(
        protected $ampq = new RabbitMQService,
    ) {}

    public function send(Request $request)
    {
        $request = request();
        $sent = $this->ampq->send(
            queue: $request->input('queue', 'random'),
            message: $request->input('message', rand(0, 9999)),
        );
        return [ 'sent' => $sent ];
    }

    public function receive($queue)
    {
        return $this->ampq->onReceive(
            queue: $queue,
        );
    }
}
