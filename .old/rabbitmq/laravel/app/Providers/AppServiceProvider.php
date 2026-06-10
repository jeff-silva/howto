<?php

namespace App\Providers;

use App\Services\RabbitMQService;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Event::listen(
        //     // PodcastProcessed::class,
        //     \App\Listeners\RabbitMQListener::class,
        // );

        // try {
        //     $rabbitmq = new RabbitMQService;
        //     $rabbitmq->onReceive('random', function($msg) {
        //         dump($msg->body);
        //         file_put_contents(
        //             filename: base_path('rabbitmq.txt'),
        //             data: json_encode($msg),
        //         );
        //     });
        // } catch (\Exception $e) {}
    }
}
