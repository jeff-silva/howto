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
        <div
          class="bg-blue-grey-darken-4 pa-2 rounded d-flex ga-3"
          style="font: 13px 'Courier New', Courier, monospace"
        >
          <pre>{{ Object.keys(openapi.value.components.schemas) }}</pre>
          <pre class="flex-grow-1">{{ openapi.value.components.schemas }}</pre>
        </div>
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
