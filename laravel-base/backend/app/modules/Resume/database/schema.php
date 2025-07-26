<?php

return [
  'resume_profile' => [
    'fields' => [
      'id' => fn ($table) => $table->id(),
      'name' => fn ($table) => $table->string('name'),
      'resume' => fn ($table) => $table->json('resume'),
      'created_at' => fn ($table) => $table->timestamp('created_at'),
      'updated_at' => fn ($table) => $table->timestamp('updated_at'),
    ],
  ],
];