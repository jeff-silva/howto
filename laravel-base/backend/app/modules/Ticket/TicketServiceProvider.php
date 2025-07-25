<?php

namespace Modules\Ticket;

use Laravel\Sanctum\Sanctum;
use App\Traits\ServiceProviderTrait;
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
        \Modules\Ticket\Http\Controllers\TicketTaskController::registerRoutes();
    }
}
