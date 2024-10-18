<template>
  <nuxt-layout name="app">
    <v-container>
      <div class="d-flex justify-end">
        <v-btn
          text="Criar"
          color="primary"
          @click="autoCarDialog.setData({}).show()"
        />
      </div>
      <br />

      <v-table class="border">
        <colgroup>
          <col width="200px" />
          <col width="300px" />
          <col width="*" />
          <col width="10px" />
        </colgroup>
        <thead>
          <tr>
            <th>Motorista</th>
            <th>Veículo</th>
            <th>Utilização</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <template v-for="o in autoCarUseSearch.response.rows">
            <tr>
              <td>#{{ o.id }} - {{ o.auto_driver?.name || null }}</td>
              <td>{{ o.auto_car?.name || null }}</td>
              <td>{{ f.date(o.use_start) }} ~ {{ f.date(o.use_final) }}</td>
              <td>
                <v-table-actions>
                  <v-btn
                    icon="material-symbols:delete"
                    color="error"
                    variant="text"
                    @click="autoCarUseDeleteHandler(o)"
                  />
                  <v-btn
                    icon="material-symbols:edit"
                    variant="text"
                    @click="autoCarDialog.setData(o).show()"
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
            v-model="autoCarUseSearch.params.page"
            :length="autoCarUseSearch.response.pages || 0"
            @update:modelValue="autoCarUseSearch.submit()"
          />
        </div>

        <div style="min-width: 200px">
          <v-select
            label="Exibir"
            v-model="autoCarUseSearch.params.per_page"
            density="compact"
            :hide-details="true"
            :items="[
              { value: 5, title: '5 ítens' },
              { value: 10, title: '10 ítens' },
              { value: 20, title: '20 ítens' },
            ]"
            @update:modelValue="autoCarUseSearch.submit()"
          />
        </div>

        <v-btn
          icon="material-symbols:search-rounded"
          variant="text"
          rounded="0"
          :loading="autoCarUseSearch.busy"
          @click="autoCarUseSearch.submit()"
        />
      </div>

      <v-dialog
        v-model="autoCarDialog.visible"
        width="700"
      >
        <v-form @submit.prevent="autoCarDialog.save()">
          <v-card v-if="autoCarDialog.data">
            <v-card-title>
              {{ autoCarDialog.data.id ? "Editar" : "Criar" }}
              veículo
            </v-card-title>
            <v-card-text>
              <v-autocomplete
                label="Motorista"
                v-model="autoCarDialog.data.driver_id"
                :error-messages="autoCarUseSave.errorField('driver_id')"
                :items="autoDriverSearch.response.rows"
                item-title="name"
                item-value="id"
              />
              <v-autocomplete
                label="Veículo"
                v-model="autoCarDialog.data.car_id"
                :error-messages="autoCarUseSave.errorField('car_id')"
                :items="autoCarSearch.response.rows"
                item-title="name"
                item-value="id"
              />

              <v-date-picker-range
                v-model:dateStart="autoCarDialog.data.use_start"
                v-model:dateFinal="autoCarDialog.data.use_final"
              />

              <v-textarea
                label="observation"
                v-model="autoCarDialog.data.observation"
                :error-messages="autoCarUseSave.errorField('observation')"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                text="Salvar"
                class="bg-primary"
                type="submit"
                :loading="autoCarUseSave.busy"
              />
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-container>
  </nuxt-layout>
</template>

<script setup>
const f = useFormatter();

const autoCarSearch = useRequest({
  method: "get",
  url: "http://localhost:3000/api/v1/auto_car",
  params: {
    page: 1,
    per_page: 1000,
  },
  response: { rows: [] },
});

const autoDriverSearch = useRequest({
  method: "get",
  url: "http://localhost:3000/api/v1/auto_driver",
  params: {
    page: 1,
    per_page: 1000,
  },
  response: { rows: [] },
});

const autoCarUseSearch = useRequest({
  method: "get",
  url: "http://localhost:3000/api/v1/auto_car_use",
  params: {
    page: 1,
    per_page: 10,
  },
  response: { rows: [] },
});

const autoCarUseSave = useRequest({
  method: "post",
  url: "http://localhost:3000/api/v1/auto_car_use",
  async onSuccess() {
    await autoCarUseSearch.submit();
    autoCarDialog.hide();
  },
});

const autoCarDialog = useDialog({
  onShow() {
    autoCarUseSave.errorClear();
  },
  async save() {
    if (this.data.id) {
      autoCarUseSave.method = "put";
      autoCarUseSave.url = `http://localhost:3000/api/v1/auto_car_use/${this.data.id}`;
      autoCarUseSave.data = this.data;
      autoCarUseSave.submit();
      return;
    }

    autoCarUseSave.method = "post";
    autoCarUseSave.url = `http://localhost:3000/api/v1/auto_car_use`;
    autoCarUseSave.data = this.data;
    autoCarUseSave.submit();
  },
});

const autoCarUseDelete = useRequest({
  method: "delete",
  url: "http://localhost:3000/api/v1/auto_car_use/0",
  async onSuccess() {
    await autoCarUseSearch.submit();
    autoCarDialog.hide();
  },
});

const autoCarUseDeleteHandler = (row) => {
  if (!confirm(`Deletar veículo #${row.id}?`)) return;
  autoCarUseDelete.url = `http://localhost:3000/api/v1/auto_car_use/${row.id}`;
  return autoCarUseDelete.submit();
};

onMounted(() => {
  autoCarSearch.submit();
  autoDriverSearch.submit();
  autoCarUseSearch.submit();
});
</script>
