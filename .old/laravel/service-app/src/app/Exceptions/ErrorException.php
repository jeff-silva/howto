<?php

namespace App\Exceptions;

use Illuminate\Contracts\Debug\ShouldntReport;

class ErrorException extends \Exception implements ShouldntReport
{
    public $status;
    public array $errors;
    public array $context;

    public function __construct($status, string $message, array $errors = [], array $context = [])
    {
        parent::__construct($message, $status);
        $this->status = $status;
        $this->errors = $errors;
        $this->context = $context;
    }

    public function render($request)
    {
        $resp = (object) array_merge([
            'status' => $this->status,
            'message' => $this->getMessage(),
            'errors' => $this->errors,
        ], $this->context);

        // \App\Models\AppError::create([
        //     'ip' => $request->ip(),
        //     'method' => $request->method(),
        //     'path' => $request->path(),
        //     'post' => $request->post(),
        //     'query' => $request->query(),
        //     'headers' => $request->headers->all(),
        //     'message' => $this->getMessage(),
        //     'errors' => $this->errors,
        // ]);

        if (config('app_config.secret.debug')) {
            $resp->route = $request->route();
            $resp->track = array_values(
                array_filter(
                    array_map(function ($trace) {
                        if (str_contains($trace['file'], '/vendor/')) return null;
                        return "{$trace['file']}:{$trace['line']}";
                    }, debug_backtrace())
                )
            );
        }

        return response()->json((array) $resp, $resp->status);
    }
}
