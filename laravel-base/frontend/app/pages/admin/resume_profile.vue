<template>
  <nuxt-layout name="main">
    <v-page-view :query="{ view: undefined }">
      <v-entity-search
        entity="resume_profile"
        :headers="[{ key: 'name', title: 'Nome' }]"
        :actions="
          (scope: Record<string, any>) => [
            {
              text: 'Nome',
              icon: 'mdi-home',
              to: `/admin/resume_profile?view=edit&id=${scope.item.id}`,
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
        entity="resume_profile"
        #default="scope"
      >
        <v-form-field label="Nome">
          <v-form-input-text v-model="scope.data.name" />
        </v-form-field>
        <v-form-actions
          :actions="[
            { text: 'Cancelar', to: { query: {} } },
            {
              text: 'Salvar',
              color: 'primary',
              type: 'submit',
              loading: scope.save.busy,
            },
          ]"
        />
      </v-entity-edit>
    </v-page-view>
  </nuxt-layout>
</template>
