```json
// composer.json
{
    // ...
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Modular\\": "modular/", // <-- Insert this line
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/"
        }
      // ...
    },
```

Generate files

```bash
composer dump-autoload
```

Register the Service Provider

```php
// app/Providers/AppServiceProvider.php
<?php

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->register(\Modular\Providers\ModularServiceProvider::class);
```

Run this command evety time system starts

```bash
php artisan module:init
```
