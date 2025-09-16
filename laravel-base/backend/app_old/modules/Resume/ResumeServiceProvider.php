<?php

namespace Modules\Resume;

use Laravel\Sanctum\Sanctum;
use Modular\Traits\ServiceProviderTrait;
use Illuminate\Support\ServiceProvider;

class ResumeServiceProvider extends ServiceProvider
{
    use ServiceProviderTrait;

    public function register(): void
    {
        $this->registerSchema(__DIR__ . '/database/schema.php');
    }


    public function boot(): void
    {
        $this->bootRoutes([
            \Modules\Resume\Http\Controllers\ResumeProfileController::class,
        ]);
    }
}
