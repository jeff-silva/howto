<?php

return [
  'app_user' => [
    'fields' => [
      'id' => fn ($table) => $table->id(),
      'name' => fn ($table) => $table->string('name'),
      'email' => fn ($table) => $table->string('email'),
      'email_verified_at' => fn ($table) => $table->timestamp('email_verified_at')->nullable(),
      'password' => fn ($table) => $table->string('password'),
      'remember_token' => fn ($table) => $table->rememberToken('remember_token'),
      'created_at' => fn ($table) => $table->timestamp('created_at'),
      'updated_at' => fn ($table) => $table->timestamp('updated_at'),
    ],
  ],

  'app_password_reset_token' => [
    'fields' => [
      // 'email' => fn ($table) => $table->string('email')->primary(),
      'email' => fn ($table) => $table->string('email'),
      'token' => fn ($table) => $table->string('token'),
      'created_at' => fn ($table) => $table->timestamp('created_at')->nullable(),
    ],
  ],

  'app_session' => [
    'fields' => [
      'id' => fn ($table) => $table->string('id')->primary(),
      'user_id' => fn ($table) => $table->foreignId('user_id')->nullable()->index(),
      'ip_address' => fn ($table) => $table->string('ip_address', 45)->nullable(),
      'user_agent' => fn ($table) => $table->text('user_agent')->nullable(),
      'payload' => fn ($table) => $table->longText('payload'),
      'last_activity' => fn ($table) => $table->integer('last_activity')->index(),
    ],
  ],

  'app_cache' => [
    'fields' => [
      'key' => fn ($table) => $table->string('key')->primary(),
      'value' => fn ($table) => $table->mediumText('value'),
      'expiration' => fn ($table) => $table->integer('expiration'),
    ],
  ],

  'app_cache_locks' => [
    'fields' => [
      'key' => fn ($table) => $table->string('key')->primary(),
      'owner' => fn ($table) => $table->string('owner'),
      'expiration' => fn ($table) => $table->integer('expiration'),
    ],
  ],

  'app_job' => [
    'fields' => [
      'id' => fn ($table) => $table->id('id'),
      'queue' => fn ($table) => $table->string('queue')->index(),
      'payload' => fn ($table) => $table->longText('payload'),
      'attempts' => fn ($table) => $table->unsignedTinyInteger('attempts'),
      'reserved_at' => fn ($table) => $table->unsignedInteger('reserved_at')->nullable(),
      'available_at' => fn ($table) => $table->unsignedInteger('available_at'),
      'created_at' => fn ($table) => $table->unsignedInteger('created_at'),
    ],
  ],

  'app_job_batches' => [
    'fields' => [
      'id' => fn ($table) => $table->string('id')->primary(),
      'name' => fn ($table) => $table->string('name'),
      'total_jobs' => fn ($table) => $table->integer('total_jobs'),
      'pending_jobs' => fn ($table) => $table->integer('pending_jobs'),
      'failed_jobs' => fn ($table) => $table->integer('failed_jobs'),
      'failed_job_ids' => fn ($table) => $table->longText('failed_job_ids'),
      'options' => fn ($table) => $table->mediumText('options')->nullable(),
      'cancelled_at' => fn ($table) => $table->integer('cancelled_at')->nullable(),
      'created_at' => fn ($table) => $table->integer('created_at'),
      'finished_at' => fn ($table) => $table->integer('finished_at')->nullable(),
    ],
  ],

  'app_failed_job' => [
    'fields' => [
      'id' => fn ($table) => $table->id('id'),
      'uuid' => fn ($table) => $table->string('uuid')->unique(),
      'connection' => fn ($table) => $table->text('connection'),
      'queue' => fn ($table) => $table->text('queue'),
      'payload' => fn ($table) => $table->longText('payload'),
      'exception' => fn ($table) => $table->longText('exception'),
      'failed_at' => fn ($table) => $table->timestamp('failed_at')->useCurrent(),
    ],
  ],
  
  'app_personal_access_token' => [
    'fields' => [
      'id' => fn ($table) => $table->id('id'),
      // 'tokenable' => fn ($table) => $table->morphs('tokenable'),
      'tokenable_type' => fn ($table) => $table->string('tokenable_type'),
      'tokenable_id' => fn ($table) => $table->foreignId('tokenable_id')->nullable()->index(),
      'name' => fn ($table) => $table->text('name'),
      'token' => fn ($table) => $table->string('token', 64)->unique(),
      'abilities' => fn ($table) => $table->text('abilities')->nullable(),
      'last_used_at' => fn ($table) => $table->timestamp('last_used_at')->nullable(),
      'expires_at' => fn ($table) => $table->timestamp('expires_at')->nullable(),
      'created_at' => fn ($table) => $table->timestamp('created_at'),
      'updated_at' => fn ($table) => $table->timestamp('updated_at'),
    ],
  ],

  'app_file' => [
    'fields' => [
      'id' => fn ($table) => $table->id(),
      'name' => fn ($table) => $table->string('name'),
      'mime' => fn ($table) => $table->string('mime'),
      'size' => fn ($table) => $table->integer('size'),
      'created_at' => fn ($table) => $table->timestamp('created_at'),
    ],
  ],
];