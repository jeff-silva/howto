<template>
  <div>
    <ui-crud model="app_file"></ui-crud>

    <ui-crud model="app_address"></ui-crud>

    <ui-crud model="app_user">
      <template #edit="scope">
        <v-text-field
          label="Nome"
          v-model="scope.modelSave.data.name"
        />
        <v-text-field
          label="E-mail"
          v-model="scope.modelSave.data.email"
        />
      </template>
    </ui-crud>
  </div>
</template>
