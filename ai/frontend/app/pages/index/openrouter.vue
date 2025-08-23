<template>
  <div>
    <v-alert type="success">
      Créditos:
      {{ credits.response.data.total_usage }} /
      {{ credits.response.data.total_credits }}
    </v-alert>
    <br />
    <v-text-field
      v-model="chat.data.messages[0]['content']"
      :append-inner-icon="chat.busy ? 'svg-spinners:dot-revolve' : 'mdi-send'"
      @click:append-inner="chat.submit()"
    />
    <pre class="bg-indigo-darken-4 pa-3">
chat.response: {{ chat.response }}</pre
    >
  </div>
</template>

<script setup>
const credits = useAxios({
  method: "get",
  url: "https://openrouter.ai/api/v1/credits",
  response: {
    data: {
      total_credits: 0,
      total_usage: 0,
    },
  },
});

credits.submit();

const chat = useAxios({
  method: "post",
  url: "https://openrouter.ai/api/v1/chat/completions",
  data: {
    model: "deepseek/deepseek-r1-0528:free",
    messages: [{ role: "user", content: "Recite um Haikai" }],
  },
  response: {
    choices: [],
  },
});
</script>
