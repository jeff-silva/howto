<?php

namespace Modules\Ticket;

use Laravel\Sanctum\Sanctum;
use Modular\Traits\ServiceProviderTrait;
use Illuminate\Support\ServiceProvider;

class TicketServiceProvider extends ServiceProvider
{
    use ServiceProviderTrait;

    public function register(): void
    {
        // 
    }


    public function boot(): void
    {
        $this->bootRoutes([
            \Modules\Ticket\Http\Controllers\TicketTaskController::class,
        ]);
    }
}
