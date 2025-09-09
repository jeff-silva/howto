<template>
  <div>
    <v-text-field
      label="Nome"
      v-model="mod.name"
    />
    <v-textarea
      label="Descrição"
      v-model="mod.description"
    />

    <div>entities</div>
    <div>routes</div>
  </div>
</template>

<script setup>
import _ from "lodash";
const route = useRoute();
const project = useProject();
const mod = _.get(project.data, `modules.${route.params.slug}`);
</script>
