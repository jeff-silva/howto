<template>
  <nuxt-layout name="app">
    <v-text-field
      v-model="project.data.version"
      label="Version"
    />

    <v-text-field
      v-model="project.data.name"
      label="Nome da aplicação"
    />

    <v-textarea
      v-model="project.data.description"
      label="Descrição"
    />
  </nuxt-layout>
</template>

<script setup>
const project = useProject();

const app = useApp();
app.title.set("Home");
app.actions.set([]);
</script>
