<template>
  <v-theme-provider
    theme="dark"
    with-background
  >
    <nuxt-page />
  </v-theme-provider>
</template>

<script setup>
const app = useApp();
app.init();
</script>
