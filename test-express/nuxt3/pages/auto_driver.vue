<template>
  <nuxt-layout name="app">
    <v-container>
      <div class="d-flex justify-end">
        <v-btn
          text="Criar"
          color="primary"
          @click="autoDriverDialog.setData({}).show()"
        />
      </div>
      <br />

      <v-table class="border">
        <colgroup>
          <col width="*" />
          <col width="10px" />
        </colgroup>
        <thead>
          <tr>
            <th>Nome</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <template v-for="o in autoDriverSearch.response.rows">
            <tr>
              <td>{{ o.name }}</td>
              <td>
                <v-table-actions>
                  <v-btn
                    icon="material-symbols:delete"
                    color="error"
                    variant="text"
                    @click="autoDriverDeleteHandler(o)"
                  />
                  <v-btn
                    icon="material-symbols:edit"
                    variant="text"
                    @click="autoDriverDialog.setData(o).show()"
                  />
                </v-table-actions>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>

      <br />
      <div class="d-flex align-center ga-3">
        <div class="flex-grow-1">
          <v-pagination
            v-model="autoDriverSearch.params.page"
            :length="autoDriverSearch.response.pages || 0"
            @update:modelValue="autoDriverSearch.submit()"
          />
        </div>

        <div style="min-width: 200px">
          <v-select
            label="Exibir"
            v-model="autoDriverSearch.params.per_page"
            density="compact"
            :hide-details="true"
            :items="[
              { value: 5, title: '5 ítens' },
              { value: 10, title: '10 ítens' },
              { value: 20, title: '20 ítens' },
            ]"
            @update:modelValue="autoDriverSearch.submit()"
          />
        </div>

        <v-btn
          icon="material-symbols:search-rounded"
          variant="text"
          rounded="0"
          :loading="autoDriverSearch.busy"
          @click="autoDriverSearch.submit()"
        />
      </div>

      <v-dialog
        v-model="autoDriverDialog.visible"
        max-width="600"
      >
        <v-form @submit.prevent="autoDriverDialog.save()">
          <v-card v-if="autoDriverDialog.data">
            <v-card-title>
              {{ autoDriverDialog.data.id ? "Editar" : "Criar" }}
              motorista
            </v-card-title>
            <v-card-text>
              <div class="flex-grow-1 overflow-auto">
                <br />
                <v-text-field
                  label="Nome"
                  v-model="autoDriverDialog.data.name"
                />
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text="Salvar"
                class="bg-primary"
                type="submit"
                :loading="autoDriverCreate.busy || autoDriverUpdate.busy"
              />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-container>
  </nuxt-layout>
</template>

<script setup>
const autoDriverSearch = useRequest({
  method: "get",
  url: "http://localhost:3000/api/v1/auto_driver",
  params: {
    page: 1,
    per_page: 10,
  },
  response: { rows: [] },
});

const autoDriverCreate = useRequest({
  method: "post",
  url: "http://localhost:3000/api/v1/auto_driver",
  async onSuccess() {
    await autoDriverSearch.submit();
    autoDriverDialog.hide();
  },
});

const autoDriverUpdate = useRequest({
  method: "put",
  url: "http://localhost:3000/api/v1/auto_driver/0",
  async onSuccess() {
    await autoDriverSearch.submit();
    autoDriverDialog.hide();
  },
});

const autoDriverDialog = useDialog({
  async save() {
    if (this.data.id) {
      autoDriverUpdate.url = `http://localhost:3000/api/v1/auto_driver/${this.data.id}`;
      autoDriverUpdate.data = this.data;
      autoDriverUpdate.submit();
      return;
    }

    autoDriverCreate.data = this.data;
    autoDriverCreate.submit();
  },
});

const autoDriverDelete = useRequest({
  method: "delete",
  url: "http://localhost:3000/api/v1/auto_driver/0",
  async onSuccess() {
    await autoDriverSearch.submit();
    autoDriverDialog.hide();
  },
});

const autoDriverDeleteHandler = (row) => {
  if (!confirm(`Deletar veículo #${row.id}?`)) return;
  autoDriverDelete.url = `http://localhost:3000/api/v1/auto_driver/${row.id}`;
  return autoDriverDelete.submit();
};

onMounted(() => {
  autoDriverSearch.submit();
});
</script>
