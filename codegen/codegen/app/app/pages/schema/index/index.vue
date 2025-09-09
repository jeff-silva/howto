<template>
  <div>
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
  </div>
</template>

<script setup>
const project = useProject();
</script>
