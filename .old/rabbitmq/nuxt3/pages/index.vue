<template>
  <div>
    <v-container>
      <div class="d-flex ga-4">
        <v-card>
          <pre class="bg-primary pa-3">express: {{ express }}</pre>
          <v-card-actions class="justify-end">
            <v-btn
              class="bg-primary"
              text="express.submit()"
              :loading="express.busy"
              @click="express.submit()"
            />
          </v-card-actions>
        </v-card>

        <v-card>
          <pre class="bg-primary pa-3">laravel: {{ laravel }}</pre>
          <v-card-actions class="justify-end">
            <v-btn
              class="bg-primary"
              text="laravel.submit()"
              :loading="laravel.busy"
              @click="laravel.submit()"
            />
          </v-card-actions>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup>
// import { Buffer } from "node:buffer";
// window.Buffer = window.Buffer;
// import amqp from "amqplib/callback_api";
// window.Buffer = Buffer;

const express = reactive({
  busy: false,
  method: "get",
  url: "http://localhost:3001/api/rabbitmq/send",
  response: null,
  error: null,

  async submit() {
    this.error = null;
    this.busy = true;
    try {
      const resp = await fetch(this.url);
      this.response = await resp.json();
    } catch (err) {
      this.error = { message: err.message };
    }
    this.busy = false;
  },
});

const laravel = reactive({
  busy: false,
  method: "get",
  url: "http://localhost:3002/api/rabbitmq/send",
  response: null,
  error: null,

  async submit() {
    this.error = null;
    this.busy = true;
    try {
      const resp = await fetch(this.url);
      this.response = await resp.json();
    } catch (err) {
      this.error = { message: err.message };
    }
    this.busy = false;
  },
});
</script>
