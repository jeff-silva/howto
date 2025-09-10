<template>
  <div>
    <v-card subtitle="Campos">
      <v-card-text>
        <v-ext-table
          :items="field.items"
          :headers="[
            { key: 'attr', title: 'Slug' },
            { key: 'name', title: 'Nome' },
            { key: 'type', title: 'Tipo' },
          ]"
          :actions="
            (ctx) => [
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
              @input="field.save()"
            />
          </template>

          <template #item.name="scope">
            <v-text-field
              v-model="scope.item.data.name"
              density="compact"
              hide-details
              @input="field.save()"
            />
          </template>

          <template #item.type="scope">
            <v-autocomplete
              v-model="scope.item.data.type"
              density="compact"
              hide-details
              :items="[
                { value: 'integer', title: 'Inteiro' },
                { value: 'float', title: 'Flutuante' },
                { value: 'string', title: 'String' },
                { value: 'date', title: 'Data' },
                { value: 'time', title: 'Hora' },
                { value: 'datetime', title: 'Data e hora' },
              ]"
              @input="field.save()"
            />
          </template>
        </v-ext-table>
      </v-card-text>
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
  </div>
</template>

<script setup>
const route = useRoute();
const project = useProject();
const entity = project.get(
  `module.${route.params.slug}.entity.${route.params.entity}`
);
const field = project.getAsList(
  `module.${route.params.slug}.entity.${route.params.entity}.field`
);
</script>
