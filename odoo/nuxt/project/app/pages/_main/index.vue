<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

const form = reactive({
  name: '',
  address: {},
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-3xl font-extrabold text-white tracking-tight">
      Hello World!
    </h1>
    <p class="text-slate-400 leading-relaxed">
      Página principal carregada via roteamento nativo do Nuxt usando o layout no modo Dark.
    </p>

    <ui-input-text v-model="form.name" label="Informe seu nome" />
    <ui-input-address v-model="form.address" label="Informe seu endereço" />

    <pre>{{ form }}</pre>
  </div>
</template>
