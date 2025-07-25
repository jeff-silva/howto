<?php

return [
  'resume_profile' => [
    'fields' => [
      'id' => fn ($table) => $table->id(),
      'name' => fn ($table) => $table->string('name'),
      'created_at' => fn ($table) => $table->timestamp('created_at'),
      'updated_at' => fn ($table) => $table->timestamp('updated_at'),
    ],
  ],
];