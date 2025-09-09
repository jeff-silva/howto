<template>
  <div>
    <v-ext-table
      :items="validations.items"
      :headers="[{ key: 'attr', title: 'attr' }]"
      :actions="
        (ctx) => [
          {
            text: 'Deletar',
            icon: 'mdi-delete',
            onClick() {
              validations.remove(ctx.item);
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
          @input="validations.save()"
        />
      </template>
    </v-ext-table>

    <v-ext-form-actions
      :actions="[
        {
          text: 'Inserir',
          onClick() {
            validations.add({ attr: '', data: {} });
          },
        },
      ]"
    />
  </div>
</template>

<script setup>
const project = useProject();
const validations = project.jsonItems("validations");
</script>
