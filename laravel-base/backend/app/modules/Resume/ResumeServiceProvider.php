<?php

namespace Modules\Resume;

use Laravel\Sanctum\Sanctum;
use App\Traits\ServiceProviderTrait;
use Illuminate\Support\ServiceProvider;

class ResumeServiceProvider extends ServiceProvider
{
    use ServiceProviderTrait;
    
    public function register(): void
    {
        // 
    }


    public function boot(): void
    {
        \Modules\Resume\Http\Controllers\ResumeProfileController::registerRoutes();
    }
}
