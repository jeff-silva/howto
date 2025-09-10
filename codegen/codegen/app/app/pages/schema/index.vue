<template>
  <div>
    <v-ext-layout>
      <template #default>
        <div class="pa-3">
          <div v-if="!project.data">
            <v-btn
              text="project.create()"
              @click="project.create()"
            />
            <v-btn
              text="project.open()"
              @click="project.open()"
            />
          </div>

          <nuxt-page v-if="project.data" />
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
          <div
            class="bg-red pa-2"
            style="font: 14px monospace"
          >
            <!-- <div>{{ project.data }}</div> -->
            <!-- <hr class="my-4 border" /> -->
            <pre>{{ project }}</pre>
          </div>
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
    </v-ext-layout>
  </div>
</template>

<script setup>
const location = window.location;
const project = useProject();
</script>
