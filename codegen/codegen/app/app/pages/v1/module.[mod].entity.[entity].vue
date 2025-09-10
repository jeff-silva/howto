<template>
  <nuxt-layout name="app">
    <v-card>
      <v-ext-table
        :items="field.items"
        :headers="[
          { key: 'attr', title: 'Slug', width: 200 },
          { key: 'name', title: 'Nome' },
          { key: 'type', title: 'Tipo', width: 200 },
        ]"
        :actions="
          (ctx) => [
            {
              text: 'Editar',
              icon: 'mdi-pen',
              to: `/v1/module.${route.params.mod}.entity.${route.params.entity}.field.${ctx.item.attr}`,
            },
            {
              text: 'Deletar',
              icon: 'mdi-delete',
              onClick() {
                field.remove(ctx.item);
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
          />
        </template>

        <template #item.name="scope">
          <v-text-field
            v-model="scope.item.data.name"
            density="compact"
            hide-details
          />
        </template>

        <template #item.type="scope">
          <v-autocomplete
            v-model="scope.item.data.type"
            density="compact"
            hide-details
            :items="
              Object.entries(project.fieldTypes()).map((item) => ({
                value: item[0],
                title: item[1],
              }))
            "
          />
        </template>
      </v-ext-table>
      <v-card-actions class="justify-end">
        <v-ext-form-actions
          :actions="[
            {
              text: 'Inserir',
              class: 'bg-primary',
              onClick() {
                field.add({ attr: '', data: {} });
              },
            },
          ]"
        />
      </v-card-actions>
    </v-card>
  </nuxt-layout>
</template>

<script setup>
const route = useRoute();

const project = useProject();
const mod = project.get(`module.${route.params.mod}`);
const entity = project.get(
  `module.${route.params.mod}.entity.${route.params.entity}`
);
const field = project.getAsList(
  `module.${route.params.mod}.entity.${route.params.entity}.field`
);

const app = useApp();
app.title.set(
  `Módulo: ${mod.name || route.params.mod} | Entidade: ${
    entity.name || route.params.entity
  }`
);
app.actions.set([
  {
    text: "Voltar",
    to: `/v1/module.${route.params.mod}`,
  },
]);
</script>
