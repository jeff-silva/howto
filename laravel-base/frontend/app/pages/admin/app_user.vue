<template>
  <nuxt-layout name="main">
    <v-page-view :query="{ view: undefined }">
      <v-entity-search
        entity="app_user"
        :headers="[{ key: 'name', title: 'Nome' }]"
        :actions="
          (scope: Record<string, any>) => [
            {
              text: 'Nome',
              icon: 'mdi-home',
              to: `/admin/app_user?view=edit&id=${scope.item.id}`,
            },
          ]
        "
      />
      <v-form-actions
        :actions="[{ text: 'Novo', to: { query: { view: 'edit' } } }]"
      />
    </v-page-view>

    <v-page-view :query="{ view: 'edit' }">
      <v-entity-edit
        entity="app_user"
        #default="scope"
      >
        <v-form-field label="Nome">
          <v-form-input-text v-model="scope.data.name" />
        </v-form-field>
        <v-form-actions
          :actions="[
            { text: 'Cancelar', to: { query: {} } },
            { text: 'Salvar', color: 'primary', type: 'submit' },
          ]"
        />
      </v-entity-edit>
    </v-page-view>
  </nuxt-layout>
</template>
