<template>
  <nuxt-layout name="app">
    <v-text-field
      label="Nome"
      v-model="field.name"
    />

    <v-autocomplete
      label="Aceita valor nulo"
      v-model="field.nullable"
      :items="[
        { value: true, title: 'Sim' },
        { value: false, title: 'Não' },
      ]"
    />

    <v-text-field
      label="Valor padrão"
      v-model="field.default"
    />

    <v-autocomplete
      label="Tipo"
      v-model="field.type"
      :items="
        Object.entries(project.fieldTypes()).map((item) => ({
          value: item[0],
          title: item[1],
        }))
      "
    />

    <template v-if="field.type == 'relation'">
      <v-autocomplete
        label="Entidade relacionada"
        v-model="field.relation.entity"
        :items="
          project.entityList().map((item) => ({
            value: item.slug,
            title: `${item.slug}`,
          }))
        "
      />

      <v-autocomplete
        label="Campo da entidade"
        v-model="field.relation.field"
        :items="
          project
            .entityFieldList()
            .filter((item) => item.entity.slug == field.relation.entity)
            .map((item) => ({
              value: item.slug,
              title: `${item.entity.slug}.${item.slug}`,
            }))
        "
      />
    </template>
  </nuxt-layout>
</template>

<script setup>
const route = useRoute();

const project = useProject();
const mod = project.get(`module.${route.params.mod}`);
const entity = project.get(
  `module.${route.params.mod}.entity.${route.params.entity}`
);
const field = project.get(
  `module.${route.params.mod}.entity.${route.params.entity}.field.${route.params.field}`
);

const app = useApp();
app.title.set(
  `Módulo: ${mod.name || route.params.mod} | Entidade: ${
    entity.name || route.params.entity
  } | Campo: ${field.name || route.params.field}`
);
app.actions.set([
  {
    text: "Voltar",
    to: `/schema/module.${route.params.mod}.entity.${route.params.entity}`,
  },
]);
</script>
