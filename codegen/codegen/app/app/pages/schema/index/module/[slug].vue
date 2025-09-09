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

    <div>entities</div>
    <div>routes</div>

    <pre>{{ mod }}</pre>
  </div>
</template>

<script setup>
import _ from "lodash";
const route = useRoute();
const project = useProject();
const mod = _.get(project.data, `module.${route.params.slug}`);
</script>
