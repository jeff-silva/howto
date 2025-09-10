<template>
  <div>
    <v-ext-layout>
      <template #default>
        <div class="pa-3">
          <template v-if="app.actions.items.length > 0">
            <v-ext-form-actions :actions="app.actions.items" />
            <br />
          </template>
          <slot></slot>
          <br />
          <v-ext-form-actions
            :actions="[
              {
                text: 'Limpar',
                onClick() {
                  project.create();
                },
              },
              {
                text: 'Recarregar',
                onClick() {
                  location.reload();
                },
              },
              { text: 'Salvar', color: 'primary', onClick: project.save },
            ]"
          />
          <!-- <pre>{{ project }}</pre> -->
        </div>
      </template>

      <template #drawer>
        <v-ext-nav
          :items="[
            { title: 'home', to: '/schema' },
            { title: 'validations', to: '/schema/validations' },
            { title: 'module', to: '/schema/module' },
          ]"
        />
      </template>

      <template #header>
        <div class="ps-3">{{ app.title.value }}</div>
        <div class="ps-3">
          <v-breadcrumbs
            divider="•"
            :items="app.breadcrumb.items"
          />
        </div>
      </template>
    </v-ext-layout>
  </div>
</template>

<script setup>
const location = window.location;
const app = useApp();
const project = useProject();
</script>
