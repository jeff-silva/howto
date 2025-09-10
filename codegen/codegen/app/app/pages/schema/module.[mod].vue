<template>
  <nuxt-layout name="app">
    <v-text-field
      v-model="mod.name"
      label="Nome"
    />

    <v-text-field
      v-model="mod.version"
      label="Versão"
    />

    <v-textarea
      v-model="mod.description"
      label="Descrição"
    />

    <v-autocomplete
      multiple
      label="Dependente de"
      v-model="mod.depends_on"
      :items="
        Object.entries(project.data.module)
          .filter(([name]) => {
            return name != route.params.mod;
          })
          .map(([name, data]) => ({
            value: name,
            title: data.name || name,
          }))
      "
    />

    <v-card title="Entidades">
      <v-ext-table
        :items="entity.items"
        :headers="[
          { key: 'attr', title: 'Slug', width: 200 },
          { key: 'name', title: 'Nome' },
        ]"
        :actions="
          (ctx) => [
            {
              text: 'Editar',
              icon: 'mdi-pen',
              to: `/schema/module.${route.params.mod}.entity.${ctx.item.attr}`,
            },
            {
              text: 'Deletar',
              icon: 'mdi-delete',
              onClick() {
                entity.remove(ctx.item);
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
      </v-ext-table>
      <v-card-actions class="justify-end">
        <v-ext-form-actions
          :actions="[
            {
              text: 'Inserir',
              class: 'bg-primary',
              onClick() {
                entity.add({ attr: '', data: {} });
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
const entity = project.getAsList(`module.${route.params.mod}.entity`);

const app = useApp();
app.title.set(`Módulo: ${mod.name || route.params.mod}`);
app.actions.set([]);
</script>
