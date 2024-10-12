<template>
  <v-container>
    <v-table class="border">
      <colgroup>
        <col width="10px" />
        <col width="80px" />
        <col width="200px" />
        <col width="*" />
        <col width="*" />
      </colgroup>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cor</th>
          <th>Placa</th>
          <th>Marca</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="o in carList.response.rows">
          <tr>
            <td>{{ o.id }}</td>
            <td><div :style="`height:20px; background:${o.color};`"></div></td>
            <td>{{ o.plate }}</td>
            <td>{{ o.brand }}</td>
            <td>
              <v-btn
                icon="material-symbols:edit"
                variant="text"
                @click="carEditDialog.setData(o).show()"
              ></v-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>

    <div class="d-flex align-center ga-3">
      <div class="flex-grow-1">
        <v-pagination
          v-model="carList.params.page"
          :length="carList.response.pages || 0"
          @update:modelValue="carList.submit()"
        />
      </div>

      <div style="min-width: 200px">
        <v-select
          label="Exibir"
          v-model="carList.params.per_page"
          density="compact"
          :hide-details="true"
          :items="[
            { value: 5, title: '5 ítens' },
            { value: 10, title: '10 ítens' },
            { value: 20, title: '20 ítens' },
          ]"
          @update:modelValue="carList.submit()"
        />
      </div>

      <v-btn
        icon="mdi-home"
        variant="text"
        rounded="0"
        :loading="carList.busy"
        @click="carList.submit()"
      />
    </div>

    <v-navigation-drawer
      v-model="carEditDialog.visible"
      width="600"
    >
      <div
        class="d-flex flex-column pa-2 ga-3 h-100 border"
        v-if="carEditDialog.data"
      >
        <div class="flex-grow-1 overflow-auto">
          <v-text-field
            label="Placa"
            v-model="carEditDialog.data.plate"
          />

          <v-menu
            :close-on-content-click="false"
            offset="10"
          >
            <template #activator="bind">
              <v-btn
                block
                :color="carEditDialog.data.color"
                v-bind="bind.props"
              />
              <br />
            </template>
            <v-color-picker
              label="Cor"
              v-model="carEditDialog.data.color"
            />
          </v-menu>

          <v-autocomplete
            label="Marca"
            v-model="carEditDialog.data.brand"
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
          <pre>{{ carEditDialog }}</pre>
        </div>
        <div class="border">Aaa</div>
        <!-- <pre>carEditDialog: {{ carEditDialog }}</pre> -->
      </div>
    </v-navigation-drawer>

    <!-- <pre>carList: {{ carList }}</pre> -->
    <pre>carEdit: {{ carEdit }}</pre>
  </v-container>
</template>

<script setup>
const carList = useRequest({
  method: "get",
  url: "http://localhost:3000/api/v1/auto_car",
  params: {
    page: 1,
    per_page: 10,
  },
  response: { rows: [] },
});

const carEdit = useRequest({
  url: "http://localhost:3000/api/v1/auto_car",
});

const carEditDialog = useDialog();

onMounted(() => {
  carList.submit();
});
</script>
