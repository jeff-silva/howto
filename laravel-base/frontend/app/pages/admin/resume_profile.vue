<template>
  <nuxt-layout name="main">
    <v-page-view :query="{ view: undefined }">
      <v-entity-search entity="resume_profile" />
      <v-form-actions
        :actions="[{ text: 'Novo', to: { query: { view: 'edit' } } }]"
      />
    </v-page-view>

    <v-page-view :query="{ view: 'edit' }">
      <v-form>
        <v-form-field label="Nome">
          <v-form-input-text />
        </v-form-field>
        <v-form-field label="Nome">
          <v-form-input-text />
        </v-form-field>
        <v-form-field label="Nome">
          <v-form-input-text />
        </v-form-field>
        <v-form-field label="Nome">
          <v-form-input-text />
        </v-form-field>
        <v-form-actions
          :actions="[
            { text: 'Cancelar', to: { query: {} } },
            { text: 'Salvar', color: 'primary', type: 'submit' },
          ]"
        />
      </v-form>
    </v-page-view>
  </nuxt-layout>
</template>
