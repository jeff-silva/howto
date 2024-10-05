<template>
  <div>
    <v-container>
      <v-btn
        text="test.submit()"
        :loading="test.busy"
        @click="test.submit()"
      />
      <pre>test: {{ test }}</pre>
    </v-container>
  </div>
</template>

<script setup>
// import { Buffer } from "node:buffer";
// window.Buffer = window.Buffer;
// import amqp from "amqplib/callback_api";
// window.Buffer = Buffer;

const test = reactive({
  busy: false,
  method: "get",
  url: "http://localhost:3001",
  response: null,
  error: null,

  async submit() {
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

onMounted(() => {
  test.submit();
});
</script>
