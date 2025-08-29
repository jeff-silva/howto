<template>
  <v-ext-layout>
    <template #drawer>
      <v-ext-nav
        :items="[
          { title: 'Info', to: '/' },
          { title: 'Schemas', to: '/components_schemas' },
        ]"
      />
    </template>

    <template #default>
      <div class="pa-3">
        <v-form @submit.prevent="openapi.save()">
          <nuxt-page v-model="openapi.value" />
          <br />
          <v-ext-form-actions
            :actions="[
              {
                text: 'Salvar',
                color: 'primary',
                type: 'submit',
                loading: openapi.saving,
              },
            ]"
          />
        </v-form>

        <br /><br />
        <dump
          v-model="openapi.value.components.schemas"
          style="height: 400px"
        />
      </div>
    </template>
  </v-ext-layout>
</template>

<script setup>
const openapi = reactive({
  saving: false,
  value: {},

  async load() {
    const resp = await $fetch("/api/openapi");
    openapi.value = resp.data;
  },

  async save() {
    openapi.saving = true;
    const resp = await $fetch("/api/openapi", {
      method: "POST",
      body: openapi.value,
    });
    openapi.value = resp.data;
    openapi.saving = false;
  },
});

await openapi.load();
</script>
