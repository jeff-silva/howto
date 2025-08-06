<template>
  <div>
    <v-btn
      text="Salvar"
      @click="api.save()"
    />
    <v-btn
      text="load"
      @click="api.load()"
    />
    <pre>{{ api.value }}</pre>
  </div>
</template>

<script setup>
const api = useOpenapi();
api.load();
</script>
