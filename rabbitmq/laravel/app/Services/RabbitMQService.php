<?php

namespace App\Services;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQService
{
    protected $connection;

    public function __construct()
    {
        $this->connection = new AMQPStreamConnection(
            host: 'rabbitmq',
            port: 5672,
            user: 'main',
            password: 'main',
        );
    }

    public function send($queue, $message) {
        $message = json_encode($message);
        $channel = $this->connection->channel();
        $channel->queue_declare(
            queue: $queue,
            passive: false,
            durable: false,
            exclusive: false,
            auto_delete: false,
        );

        $channel->basic_publish(
            msg: new AMQPMessage($message),
            routing_key: $queue,
            exchange: '',
        );

        $channel->close();
        $this->connection->close();

        return [ 'message' => $message ];
    }

    public function onReceive($queue) {
        return uniqid();
    }
}
