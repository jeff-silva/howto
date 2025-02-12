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

    <ui-model-crud model="app_address">
      <template #edit="scope">
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <v-text-field
              label="Buscar"
              v-model="appAddressAutocomplete.params.search"
              hide-details="auto"
              append-inner-icon="mdi-magnify"
              @click:append-inner="appAddressAutocomplete.submit()"
            />
            <v-card v-if="appAddressAutocomplete.response.result.length > 0">
              <v-list>
                <template v-for="o in appAddressAutocomplete.response.result">
                  <v-list-item @click="scope.modelSave.data = o">
                    <v-list-item-title>{{ o.name }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="12"
          >
            <v-text-field
              label="Nome"
              v-model="scope.modelSave.data.name"
              hide-details="auto"
              :error-messages="scope.modelSave.error.getField('name')"
            />
          </v-col>
          <v-col
            cols="12"
            md="12"
          >
            <v-text-field
              label="Rua"
              v-model="scope.modelSave.data.route"
              hide-details="auto"
              :error-messages="scope.modelSave.error.getField('route')"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              label="Nº"
              v-model="scope.modelSave.data.number"
              hide-details="auto"
              :error-messages="scope.modelSave.error.getField('number')"
            />
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <v-text-field
              label="Complemento"
              v-model="scope.modelSave.data.complement"
              hide-details="auto"
              :error-messages="scope.modelSave.error.getField('complement')"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              label="CEP"
              v-model="scope.modelSave.data.zipcode"
              hide-details="auto"
              :error-messages="scope.modelSave.error.getField('zipcode')"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              label="Bairro"
              v-model="scope.modelSave.data.district"
              hide-details="auto"
              :error-messages="scope.modelSave.error.getField('district')"
            />
          </v-col>
          <v-col
            cols="12"
            md="12"
          >
            <v-text-field
              label="Cidade"
              v-model="scope.modelSave.data.city"
              hide-details="auto"
              :error-messages="scope.modelSave.error.getField('city')"
            />
          </v-col>
        </v-row>
      </template>
    </ui-model-crud>

    <ui-model-crud model="app_file">
      <template #edit="scope">
        <v-file-input
          v-model="appFileUpload.data.file"
          @change="
            async () => {
              await appFileUpload.submit();
              scope.modelList.submit();
            }
          "
        />
      </template>
    </ui-model-crud>
  </div>
</template>

<script setup>
const appAddressAutocomplete = useAxios({
  method: "get",
  url: "api://app_address/autocomplete",
  params: { search: "" },
  response: {
    result: [],
  },
});
const appFileUpload = useAxios({
  method: "post",
  url: "api://app_file/upload",
});
</script>
