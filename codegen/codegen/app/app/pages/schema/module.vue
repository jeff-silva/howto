<template>
  <nuxt-layout name="app">
    <v-ext-table
      :items="mod.items"
      :headers="[
        { key: 'attr', title: 'Slug', width: 200 },
        { key: 'name', title: 'Nome' },
      ]"
      :actions="
        (ctx) => [
          {
            text: 'Editar',
            icon: 'mdi-pen',
            to: `/schema/module.${ctx.item.attr}`,
          },
          {
            text: 'Deletar',
            icon: 'mdi-delete',
            onClick() {
              mod.remove(ctx.item);
            },
          },
        ]
      "
    >
      <template #item.attr="scope">
        <v-text-field
          v-model="scope.item.attr"
          density="compact"
          hide-details
          @input="mod.save()"
        />
      </template>

      <template #item.name="scope">
        <v-text-field
          v-model="scope.item.data.name"
          density="compact"
          hide-details
          @input="mod.save()"
        />
      </template>
    </v-ext-table>
  </nuxt-layout>
</template>

<script setup>
const project = useProject();
const mod = project.getAsList("module");

const app = useApp();
app.title.set("Módulos");
app.actions.set([
  {
    text: "Inserir",
    color: "primary",
    onClick() {
      mod.add({ attr: "", data: {} });
    },
  },
]);
</script>
