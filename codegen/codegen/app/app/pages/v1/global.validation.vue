<template>
  <nuxt-layout name="app">
    <div>Validation</div>
  </nuxt-layout>
</template>

<script setup>
const project = useProject();

const app = useApp();
app.title.set("Validation");
app.actions.set([]);
</script>
