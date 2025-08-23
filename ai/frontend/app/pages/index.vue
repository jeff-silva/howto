<template>
  <v-app-layout>
    <template #drawer>
      <v-nav :items="nav.items" />
    </template>

    <template #default>
      <nuxt-page />
    </template>
  </v-app-layout>
</template>

<script setup>
const nav = reactive({
  items: [
    { title: "Início", to: "/" },
    { title: "Game", to: "/game" },
    { title: "Langchain + Openrouter", to: "/langchain-openrouter" },
  ],
});
</script>
