<template>
  <nuxt-layout name="app">
    <!-- <v-checkbox
      label="Minimizar projeto ao salvar?"
      v-model="config.minify"
    /> -->
    <v-checkbox
      label="Minimizar projeto ao salvar?"
      v-model="project.data.global.config.minify"
    />
  </nuxt-layout>
</template>

<script setup>
const project = useProject();
const config = project.get("global.config", {});

const app = useApp();
app.title.set("Config");
app.actions.set([]);
</script>
