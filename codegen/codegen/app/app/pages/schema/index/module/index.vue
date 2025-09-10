<template>
  <div>
    <v-ext-table
      :items="module.items"
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
              module.remove(ctx.item);
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
          @input="module.save()"
        />
      </template>

      <template #item.data.name="scope">
        <v-text-field
          v-model="scope.item.data.name"
          density="compact"
          hide-details
          @input="module.save()"
        />
      </template>
    </v-ext-table>

    <v-ext-form-actions
      :actions="[
        {
          text: 'Inserir',
          onClick() {
            module.add({ attr: '', data: {} });
          },
        },
      ]"
    />

    <pre>{{ module }}</pre>
  </div>
</template>

<script setup>
const project = useProject();
const module = project.getAsList("module");
</script>
