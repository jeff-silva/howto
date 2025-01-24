<template>
  <div>
    <ui-model-crud model="app_user">
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
        <ui-model-select
          model="app_user_group"
          v-model="scope.modelSave.data.group_id"
          :error-messages="scope.modelSave.error.getField('group_id')"
        />
      </template>
    </ui-model-crud>

    <ui-model-crud model="app_user_group"></ui-model-crud>

    <ui-model-crud model="app_address"></ui-model-crud>

    <ui-model-crud model="app_file"></ui-model-crud>
  </div>
</template>
