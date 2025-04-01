<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>{{
        appLoad.response.user ? appLoad.response.user.name : "Guest"
      }}</v-toolbar-title>
      <template #append>
        <div class="d-flex ga-1">
          <v-btn
            text="Logout"
            @click="authLogout.submit()"
          />
        </div>
      </template>
    </v-toolbar>
    <br />

    <v-expand-transition>
      <v-card
        v-if="!appLoad.response.user"
        class="mb-4"
      >
        <v-card-title>Login</v-card-title>
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
    </v-expand-transition>

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
              <template v-for="o in appUserList.response.data">
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
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="page"
                  type="number"
                  hide-details
                  v-model.number="appUserList.params.page"
                  @update:model-value="appUserList.submit()"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  label="per_page"
                  hide-details
                  v-model="appUserList.params.per_page"
                  :items="[
                    { value: 2, title: '2 Itens' },
                    { value: 10, title: '10 Itens' },
                    { value: 50, title: '50 Itens' },
                    { value: 100, title: '100 Itens' },
                  ]"
                  @update:model-value="
                    () => {
                      appUserList.params.page;
                      appUserList.submit();
                    }
                  "
                />
              </v-col>
            </v-row>
          </v-card-text>
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
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const appUserList = useAxios({
  method: "get",
  url: "api://app_user",
  params: {
    page: 1,
    per_page: 10,
  },
  response: {
    data: [],
  },
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
    appLoad.submit();
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
    appLoad.submit();
  },
});

const authLogout = reactive({
  async submit() {
    localStorage.removeItem("api_token");
    appLoad.submit();
  },
});

const appLoad = useAxios({
  method: "get",
  url: "api://app/load",
  response: {},
});

appLoad.submit();
appUserSave.edit({});
appUserList.submit();
</script>
