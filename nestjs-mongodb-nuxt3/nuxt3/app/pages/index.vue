<template>
  <v-container>
    <v-card>
      <v-card-text>Login</v-card-text>
      <v-card-text>
        <v-text-field
          v-model="authLogin.data.email"
          label="E-mail"
        />
        <v-text-field
          v-model="authLogin.data.password"
          label="E-mail"
        />
        <v-btn
          text="Entrar"
          @click="authLogin.submit()"
        />
      </v-card-text>
    </v-card>
    <br />

    <v-btn
      text="Profile"
      @click="appLoad.submit()"
    />
    <pre>appLoad: {{ appLoad }}</pre>

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
            <v-col cols="12">
              <v-card>
                <v-card-title>Contatos</v-card-title>
                <v-card-text>
                  <template v-for="(o, i) in appUserSave.data.contacts">
                    <app-contact
                      :model-value="o"
                      hide-details
                      @update:model-value="
                        appUserSave.data.contacts[i] = $event
                      "
                    />
                  </template>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    class="bg-primary"
                    text="Add"
                    @click="appUserSave.data.contacts.push({})"
                  />
                </v-card-actions>
              </v-card>
              <br />
            </v-col>
            <v-col cols="12">
              <v-card>
                <v-card-title>Endereços</v-card-title>
                <v-card-text>
                  <template v-for="(o, i) in appUserSave.data.addresses">
                    <app-address
                      :model-value="o"
                      hide-details
                      @update:model-value="
                        appUserSave.data.addresses[i] = $event
                      "
                    />
                  </template>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    class="bg-primary"
                    text="Add"
                    @click="appUserSave.data.addresses.push({})"
                  />
                </v-card-actions>
              </v-card>
              <br />
            </v-col>
          </v-row>
          <div class="d-flex ga-3">
            <v-btn
              text="Salvar"
              type="submit"
            />
            <v-btn
              text="Novo"
              @click="appUserSave.edit({})"
            />
          </div>
          <pre>appUserSave: {{ appUserSave }}</pre>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const appUserList = useAxios({
  method: "get",
  url: "api://app_user",
  response: [],
});

const appUserSave = useAxios({
  method: "post",
  url: "api://app_user",
  data: {},
  edit(data) {
    appUserSave.data = JSON.parse(JSON.stringify(data));
    appUserSave.data.contacts = appUserSave.data.contacts || [];
    appUserSave.data.addresses = appUserSave.data.addresses || [];
  },
  onSuccess(resp) {
    appUserSave.data = {};
    appUserList.submit();
  },
  onBeforeSubmit({ self }) {
    if (self.data._id) {
      self.url = `api://app_user/${self.data._id}`;
      self.method = "patch";
      return;
    }

    self.url = `api://app_user`;
    self.method = "post";
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

const authLogin = useAxios({
  method: "post",
  url: "api://auth/login",
  data: { email: null, password: null },
  onSuccess(resp) {
    if (!resp.data.access_token) return;
    localStorage.setItem("api_token", resp.data.access_token);
  },
});

const appLoad = useAxios({
  method: "get",
  url: "api://app/load",
});

appUserSave.edit({});
appUserList.submit();
</script>
