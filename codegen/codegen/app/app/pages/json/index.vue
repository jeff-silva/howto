<template>
  <div class="pa-3">
    <div class="grid">
      <div>
        <v-btn
          text="Info"
          @click="appInfo.toggle()"
        />
        <v-btn
          text="global.config"
          @click="appGlobalConfig.toggle()"
        />
        <v-btn
          text="global.validation"
          @click="appGlobalValidation.toggle()"
        />
      </div>

      <div>
        <v-btn
          text="module"
          @click="appModule.toggle()"
        />
      </div>

      <div>
        <v-btn
          text="Abrir"
          @click="project.open()"
        />
        <v-btn
          text="Salvar"
          @click="project.save()"
        />
      </div>

      <pre class="bg-blue-grey-darken-4 pa-2 rounded">{{ project }}</pre>
    </div>

    <app-json-dialog
      v-model="appInfo"
      title="info"
    >
      <v-text-field
        label="Nome da aplicação"
        v-model="project.data.name"
      />
      <v-text-field
        label="Versão"
        v-model="project.data.version"
      />
      <v-textarea
        label="Descrição"
        v-model="project.data.description"
        auto-grow
      />
    </app-json-dialog>

    <app-json-dialog
      v-model="appGlobalConfig"
      title="global.config"
    >
      <v-checkbox
        label="Salvar projeto de forma compacta?"
        v-model="project.data.global.config.minify"
      />
    </app-json-dialog>

    <app-json-dialog
      v-model="appGlobalValidation"
      title="global.validation"
    >
      <div>Validações</div>
    </app-json-dialog>

    <app-json-to-array
      v-model="project.data.module"
      #default="appModuleScope"
    >
      <app-json-dialog
        v-model="appModule"
        title="module"
      >
        <v-ext-table
          :items="appModuleScope.model.items"
          :headers="[
            { key: 'key', title: 'Key' },
            { key: 'name', title: 'Nome' },
          ]"
          :actions="
            (scope) => [
              {
                text: 'Editar',
                icon: 'mdi-pen',
                color: 'primary',
                onClick() {
                  appModuleEdit.edit(scope.item);
                },
              },
              {
                text: 'Deletar',
                icon: 'mdi-delete',
                color: 'error',
                onClick() {
                  appModuleScope.model.remove(scope.item);
                },
              },
            ]
          "
        >
          <template #item.key="ctx">
            <v-text-field
              v-model="ctx.item._key"
              density="compact"
              hide-details
            />
            <!-- <pre>{{ ctx.item }}</pre> -->
          </template>
          <template #item.name="ctx">
            <v-text-field
              v-model="ctx.item._value.name"
              density="compact"
              hide-details
            />
          </template>
        </v-ext-table>
        <v-ext-form-actions
          :actions="[
            {
              text: 'Inserir',
              onClick() {
                appModuleScope.model.add();
              },
            },
          ]"
        />
      </app-json-dialog>
    </app-json-to-array>

    <app-json-dialog
      v-model="appModuleEdit"
      title="module: edit"
      :actions="[
        {
          text: 'Módulos',
          onClick() {
            appModule.toggle(true);
            appModuleEdit.toggle(false);
          },
        },
      ]"
    >
      <template v-if="!!appModuleEdit.editData">
        <v-text-field
          v-model="appModuleEdit.editData._key"
          label="Key"
        />
        <v-text-field
          v-model="appModuleEdit.editData._value.name"
          label="Nome"
        />
        <v-text-field
          v-model="appModuleEdit.editData._value.version"
          label="Versão"
        />
        <v-textarea
          v-model="appModuleEdit.editData._value.description"
          label="Descrição"
        />
        <v-autocomplete
          v-model="appModuleEdit.editData._value.depends_on"
          label="Depende de"
          multiple
          :items="
            Object.entries(project.data.module)
              .filter(([name]) => {
                return name != appModuleEdit.editData._key;
              })
              .map(([name, data]) => ({
                value: name,
                title: data.name || name,
              }))
          "
        />

        <!-- <pre>{{ appModuleEdit.editData }}</pre> -->

        <app-json-to-array
          v-model="appModuleEdit.editData._value.entity"
          #default="appModuleEntityScope"
        >
          <v-ext-table :items="appModuleEntityScope.model.items"></v-ext-table>
          <pre>{{ appModuleEntityScope }}</pre>
        </app-json-to-array>
      </template>
    </app-json-dialog>
  </div>
</template>

<style>
.grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.grid > div {
  display: flex;
  gap: 15px;
}
</style>

<script setup>
const useDialog = (config = {}) => {
  const r = reactive({
    visible: false,
    ...config,

    toggle(value = null) {
      r.visible = value === null ? !r.visible : value;
    },
  });

  return r;
};

const project = useProject();

project.dataArray = () => {
  const recursiveData = (data, deep = 0, parent = null, items = []) => {
    if (data !== null && typeof data === "object") {
      for (const key in data) {
        const path = parent ? `${parent.path}.${key}` : key;
        const value = data[key];
        let type = typeof value;
        if (value === null) type = "null";
        else if (Array.isArray(value)) type = "array";
        const item = {
          path,
          key,
          type,
          deep,
          parent: parent ? { ...parent, parent: undefined } : null,
          value,
        };
        items.push(item);
        items = recursiveData(value, deep + 1, item, items);
      }
    }

    return items;
  };

  return recursiveData(project.data);
};

const appInfo = useDialog();
const appGlobalConfig = useDialog();
const appGlobalValidation = useDialog();
const appModule = useDialog();
const appModuleEdit = useDialog({
  editData: null,
  visible: true,
  editData: { _key: "xx", _value: {} },
  edit(value) {
    appModule.toggle(false);
    appModuleEdit.toggle(true);
    appModuleEdit.editData = value;
  },
});
const appModuleEntity = useDialog();
const appModuleEntityField = useDialog();
const appModuleRoute = useDialog();
</script>
