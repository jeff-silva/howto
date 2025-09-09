<template>
  <div>
    <v-ext-table
      :items="modules.items"
      :headers="[
        { key: 'attr', title: 'attr' },
        { key: 'data.name', title: 'Nome' },
      ]"
      :actions="
        (ctx) => [
          {
            text: 'Editar',
            icon: 'mdi-pen',
            to: `/schema/module/${ctx.item.attr}`,
          },
          {
            text: 'Deletar',
            icon: 'mdi-delete',
            onClick() {
              modules.remove(ctx.item);
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
          @input="modules.save()"
        />
      </template>

      <template #item.data.name="scope">
        <v-text-field
          v-model="scope.item.data.name"
          density="compact"
          hide-details
          @input="modules.save()"
        />
      </template>
    </v-ext-table>

    <v-ext-form-actions
      :actions="[
        {
          text: 'Inserir',
          onClick() {
            modules.add({ attr: '', data: {} });
          },
        },
      ]"
    />

    <pre>{{ modules }}</pre>
  </div>
</template>

<script setup>
const project = useProject();
const modules = project.jsonItems("modules");
</script>
