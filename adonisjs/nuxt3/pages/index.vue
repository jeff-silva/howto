<template>
  <div>
    <ui-crud model="app_user">
      <template #edit="scope">
        <v-text-field
          label="Nome"
          v-model="scope.modelSave.data.name"
          :error-messages="scope.modelSave.error.getField('name')"
        />
        <v-text-field
          label="E-mail"
          v-model="scope.modelSave.data.email"
          :error-messages="scope.modelSave.error.getField('email')"
        />
      </template>
    </ui-crud>

    <ui-crud model="app_address"></ui-crud>

    <ui-crud model="app_file"></ui-crud>
  </div>
</template>
