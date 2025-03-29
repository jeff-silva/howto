<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-table>
            <colgroup>
              <col width="*" />
              <col width="0" />
              <col width="0" />
            </colgroup>
            <thead>
              <tr>
                <th>Nome</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="o in appUserList.response">
                <tr>
                  <td>{{ o.name }}</td>
                  <td class="pa-0">
                    <v-btn
                      rounded="0"
                      icon="mdi-pen"
                      color="primary"
                      @click="appUserSave.edit(o)"
                    />
                  </td>
                  <td class="pa-0">
                    <v-btn
                      rounded="0"
                      icon="mdi-delete"
                      color="error"
                      @click="appUserDelete.delete(o)"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
        </v-card>
        <br />
        <v-btn
          text="Submit"
          @click="appUserList.submit()"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-form @submit.prevent="appUserSave.submit()">
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field v-model="appUserSave.data.name" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="appUserSave.data.email" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="appUserSave.data.password" />
            </v-col>
          </v-row>
          <div class="d-flex ga-3">
            <v-btn
              text="Salvar"
              type="submit"
            /><v-btn
              text="Limpar"
              @click="appUserSave.data = {}"
            />
          </div>
        </v-form>
      </v-col>
    </v-row>

    <pre>appUserDelete: {{ appUserDelete }}</pre>
  </v-container>
</template>

<script setup>
const appUserList = useAxios({
  method: "get",
  url: "api://app_user",
  response: [],
});

const appUserSave = useAxios({
  method: (self) => (self.data._id ? "patch" : "post"),
  url: (self) =>
    self.data._id ? `api://app_user/${self.data._id}` : "api://app_user",
  data: {},
  edit(data) {
    appUserSave.data = JSON.parse(JSON.stringify(data));
  },
  onSuccess(resp) {
    appUserSave.data = resp.data;
    appUserList.submit();
  },
});

const appUserDelete = useAxios({
  method: "delete",
  url: "api://app_user",
  delete(data) {
    appUserDelete.url = `api://app_user/${data._id}`;
    appUserDelete.submit();
  },
  onSuccess() {
    appUserList.submit();
  },
});

appUserList.submit();
</script>
