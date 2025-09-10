<template>
  <div>
    <v-text-field
      label="Nome"
      v-model="mod.name"
    />
    <v-text-field
      label="Versão"
      v-model="mod.version"
    />
    <v-textarea
      label="Descrição"
      v-model="mod.description"
    />
    <v-autocomplete
      multiple
      label="Dependente de"
      v-model="mod.depends_on"
      :items="
        Object.entries(project.data.module)
          .filter(([name]) => {
            return name != route.params.slug;
          })
          .map(([name, data]) => ({
            value: name,
            title: data.name,
          }))
      "
    />

    <v-card subtitle="Entidades">
      <v-card-text>
        <v-ext-table
          :items="entity.items"
          :headers="[
            { key: 'attr', title: 'Slug' },
            { key: 'name', title: 'Nome' },
          ]"
          :actions="
            (ctx) => [
              {
                text: 'Editar',
                icon: 'mdi-pen',
                to: `/schema/module/${route.params.slug}/entity/${ctx.item.attr}`,
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
              @input="entity.save()"
            />
          </template>
          <template #item.name="scope">
            <v-text-field
              v-model="scope.item.data.name"
              density="compact"
              hide-details
              @input="entity.save()"
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
                entity.add({ attr: '', data: {} });
              },
            },
          ]"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import _ from "lodash";
const route = useRoute();
const project = useProject();
const mod = project.get(`module.${route.params.slug}`);
const entity = project.getAsList(`module.${route.params.slug}.entity`);
// const endpoint = project.getAsList(`module.${route.params.slug}.endpoint`);
</script>
