<template>
  <div>
    <v-ext-form-actions
      :actions="[
        {
          text: 'Voltar',
          to: '/schema/module',
        },
      ]"
    />
    <br />
    <nuxt-page />
  </div>
</template>

<script setup>
const project = useProject();
const modules = project.jsonItems("modules");
</script>
