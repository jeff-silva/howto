<template>
  <nuxt-layout name="app">
    <v-form-field label="Título">
      <v-text-field v-model="api.value.info.title" />
    </v-form-field>

    <v-form-field label="Descrição">
      <v-textarea
        v-model="api.value.info.description"
        auto-grow
      />
    </v-form-field>

    <v-form-field label="Contato">
      <v-text-field v-model="api.value.info.contact.email" />
    </v-form-field>

    <v-form-field label="Versão">
      <v-text-field v-model="api.value.info.version" />
    </v-form-field>

    <v-btn
      text="Salvar"
      @click="api.save()"
    />
    <v-btn
      text="load"
      @click="api.load()"
    />
    <pre>{{ api.value }}</pre>
  </nuxt-layout>
</template>

<script setup>
const api = useOpenapi();
</script>
