<template>
  <nuxt-page />
</template>

<script setup>
const api = useOpenapi();
api.load();
</script>
