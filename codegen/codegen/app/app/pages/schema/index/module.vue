<template>
  <div>
    <v-navigation-drawer>
      <v-ext-nav
        :items="[
          { title: 'Módulos', to: '/schema/module' },
          ...module.items.map((mod) => {
            return {
              title: mod.data.name || mod.attr,
              to: `/schema/module/${mod.attr}`,
            };
          }),
        ]"
      />
    </v-navigation-drawer>
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
const module = project.getAsList("module");
</script>
