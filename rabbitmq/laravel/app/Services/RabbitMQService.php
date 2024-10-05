<?php

namespace App\Services;

use Closure;
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

    public function getChannel($queue)
    {
        $channel = $this->connection->channel();
        $channel->queue_declare(
            queue: $queue,
            passive: false,
            durable: false,
            exclusive: false,
            auto_delete: false,
        );
        return $channel;
    }

    public function send($queue, $message) {
        $channel = $this->getChannel($queue);
        $message = json_encode($message);

        $channel->basic_publish(
            msg: new AMQPMessage($message),
            routing_key: $queue,
            exchange: '',
        );

        $channel->close();
        $this->connection->close();

        return [ 'message' => $message ];
    }

    public function onReceive($queue, Closure $callback)
    {
        $channel = $this->getChannel($queue);
        $channel->basic_consume(
            queue: $queue,
            consumer_tag: '',
            no_local: false,
            no_ack: true,
            exclusive: false,
            nowait: false,
            callback: $callback,
        );

        $channel->consume();
        return $channel;
    }
}
