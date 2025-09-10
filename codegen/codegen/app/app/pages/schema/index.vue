<template>
  <nuxt-layout name="app">
    <v-text-field
      v-model="project.data.version"
      label="Version"
    />

    <v-text-field
      v-model="project.data.name"
      label="Nome da aplicação"
    />

    <v-textarea
      v-model="project.data.description"
      label="Descrição"
    />

    <v-card title="Módulos">
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
      <v-card-actions class="justify-end">
        <v-ext-form-actions
          :actions="[
            {
              text: 'Inserir',
              class: 'bg-primary',
              onClick() {
                mod.add({ attr: '', data: {} });
              },
            },
          ]"
        />
      </v-card-actions>
    </v-card>
    <!-- <pre>{{ mod.items }}</pre> -->
  </nuxt-layout>
</template>

<script setup>
const project = useProject();
const mod = project.getAsList("module");

const app = useApp();
app.title.set("Home");
app.actions.set([]);
</script>
