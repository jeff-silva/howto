<template>
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
        <col width="*" />
        <col width="80px" />
        <col width="140px" />
      </colgroup>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Cor</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <template v-for="o in autoCarSearch.response.rows">
          <tr>
            <td>{{ o.name }}</td>
            <td><div :style="`height:20px; background:${o.color};`"></div></td>
            <td>
              <v-btn
                icon="material-symbols:edit"
                variant="text"
                @click="autoCarDialog.setData(o).show()"
              ></v-btn>
              <v-btn
                icon="material-symbols:delete"
                color="error"
                variant="text"
                @click="autoCarDeleteHandler(o)"
              ></v-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>

    <br />
    <div class="d-flex align-center ga-3">
      <div class="flex-grow-1">
        <v-pagination
          v-model="autoCarSearch.params.page"
          :length="autoCarSearch.response.pages || 0"
          @update:modelValue="autoCarSearch.submit()"
        />
      </div>

      <div style="min-width: 200px">
        <v-select
          label="Exibir"
          v-model="autoCarSearch.params.per_page"
          density="compact"
          :hide-details="true"
          :items="[
            { value: 5, title: '5 ítens' },
            { value: 10, title: '10 ítens' },
            { value: 20, title: '20 ítens' },
          ]"
          @update:modelValue="autoCarSearch.submit()"
        />
      </div>

      <v-btn
        icon="mdi-home"
        variant="text"
        rounded="0"
        :loading="autoCarSearch.busy"
        @click="autoCarSearch.submit()"
      />
    </div>

    <v-navigation-drawer
      v-model="autoCarDialog.visible"
      width="600"
    >
      <v-form
        class="d-flex flex-column pa-2 ga-3 h-100 border"
        v-if="autoCarDialog.data"
        @submit.prevent="autoCarDialog.save()"
      >
        <div class="flex-grow-1 overflow-auto">
          <br />
          <v-text-field
            label="Placa"
            v-model="autoCarDialog.data.plate"
          />

          <v-menu
            :close-on-content-click="false"
            offset="10"
            width="200"
          >
            <template #activator="bind">
              <v-btn
                block
                :color="autoCarDialog.data.color || 'primary'"
                :text="autoCarDialog.data.color || 'Vazio'"
                v-bind="bind.props"
              />
              <br />
            </template>
            <v-color-picker
              label="Cor"
              v-model="autoCarDialog.data.color"
            />
          </v-menu>

          <v-autocomplete
            label="Marca"
            v-model="autoCarDialog.data.brand"
            :items="[
              'Chevrolet',
              'Dodge',
              'Fiat',
              'Mitsubishi',
              'Bmw',
              'Suzuki',
              'Sundown',
              'Ducati',
              'Scania',
              'Hyundai',
              'Volkswagen',
              'Volvo',
            ]"
          />
        </div>
        <div class="d-flex justify-end">
          <v-btn
            text="Salvar"
            color="primary"
            type="submit"
            :loading="autoCarCreate.busy || autoCarUpdate.busy"
          />
        </div>
      </v-form>
    </v-navigation-drawer>
    <pre>autoCarCreate: {{ autoCarCreate }}</pre>
    <pre>autoCarUpdate: {{ autoCarUpdate }}</pre>
  </v-container>
</template>

<script setup>
const autoCarSearch = useRequest({
  method: "get",
  url: "http://localhost:3000/api/v1/auto_car",
  params: {
    page: 1,
    per_page: 10,
  },
  response: { rows: [] },
});

const autoCarCreate = useRequest({
  method: "post",
  url: "http://localhost:3000/api/v1/auto_car",
  async onSuccess() {
    await autoCarSearch.submit();
    autoCarDialog.hide();
  },
});

const autoCarUpdate = useRequest({
  method: "put",
  url: "http://localhost:3000/api/v1/auto_car/0",
  async onSuccess() {
    await autoCarSearch.submit();
    autoCarDialog.hide();
  },
});

const autoCarDialog = useDialog({
  async save() {
    if (this.data.id) {
      autoCarUpdate.url = `http://localhost:3000/api/v1/auto_car/${this.data.id}`;
      autoCarUpdate.data = this.data;
      autoCarUpdate.submit();
      return;
    }

    autoCarCreate.data = this.data;
    autoCarCreate.submit();
  },
});

const autoCarDelete = useRequest({
  method: "delete",
  url: "http://localhost:3000/api/v1/auto_car/0",
  async onSuccess() {
    await autoCarSearch.submit();
    autoCarDialog.hide();
  },
});

const autoCarDeleteHandler = (row) => {
  if (!confirm(`Deletar veículo #${row.id}?`)) return;
  autoCarDelete.url = `http://localhost:3000/api/v1/auto_car/${row.id}`;
  return autoCarDelete.submit();
};

onMounted(() => {
  autoCarSearch.submit();
});
</script>
