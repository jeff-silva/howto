<template>
  <v-container>
    <!-- <pre>props: {{ props }}</pre> -->
    <!-- <pre>modelList: {{ modelList }}</pre> -->

    <div class="d-flex align-center justify-end ga-2 mb-3">
      <div class="flex-grow-1">{{ props.model }}</div>
      <v-btn
        color="primary"
        text="Criar"
        :loading="modelSave.busy"
        @click="modelSaveDialog.toggle()"
      />
      <v-btn
        color="primary"
        text="Atualizar"
        :loading="modelList.busy"
        @click="modelList.submit()"
      />
    </div>

    <v-card :loading="modelList.busy">
      <v-table>
        <colgroup>
          <col width="*" />
          <col width="0" />
          <col width="0" />
        </colgroup>
        <thead>
          <tr>
            <th>name</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="o in modelList.response.data">
            <tr>
              <td>{{ o.name }}</td>
              <td class="pa-0">
                <v-btn
                  color="primary"
                  icon="mdi:edit"
                  rounded="0"
                  @click="modelSave.edit(o)"
                />
              </td>
              <td class="pa-0">
                <v-btn
                  color="error"
                  icon="mdi:delete"
                  rounded="0"
                  @click="modelDelete.delete(o)"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog
      v-model="modelSaveDialog.visible"
      max-width="700"
    >
      <v-form @submit.prevent="modelSave.submit()">
        <v-card>
          <v-card-title>Edit {{ props.model }}</v-card-title>
          <v-card-text>
            <slot
              name="edit"
              v-bind="scope()"
            >
              <v-text-field
                label="Nome"
                v-model="modelSave.data.name"
                :error-messages="modelSave.error.getField('name')"
              />
            </slot>
            <!-- <pre>modelSave.error: {{ modelSave.error }}</pre> -->
          </v-card-text>
          <v-card-actions>
            <v-btn
              type="submit"
              text="Salvar"
              class="bg-primary"
              :loading="modelSave.busy"
            />
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script setup>
const props = defineProps({
  model: { type: String, default: null },
});

const modelList = useAxios({
  method: "get",
  url: `api://${props.model}`,
  response: { data: [] },
});

const modelSave = useAxios({
  method: "post",
  url: `api://${props.model}`,
  data: {},
  async onSuccess() {
    await modelList.submit();
    modelSaveDialog.toggle(false);
    modelSave.data = {};
  },
  edit(item) {
    modelSave.data = item;
    modelSaveDialog.toggle(true);
  },
});

const modelDelete = useAxios({
  method: "delete",
  url: `api://${props.model}`,
  delete(item) {
    if (!confirm("Deletar?")) return;
    modelDelete.url = `api://${props.model}/${item.id}`;
    modelDelete.submit();
  },
  async onSuccess() {
    await modelList.submit();
    modelSaveDialog.toggle(false);
    modelSave.data = {};
  },
});

const modelSaveDialog = reactive({
  visible: false,
  toggle(value = null) {
    modelSaveDialog.visible = value === null ? !modelSaveDialog.visible : value;
    modelSave.error.clear();
  },
});

const scope = (merge = {}) => {
  return { modelList, modelSave, ...merge };
};

modelList.submit();
</script>
