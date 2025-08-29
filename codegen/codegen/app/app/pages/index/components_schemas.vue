<template>
  <div>
    <v-row>
      <v-col cols="3">
        <v-list>
          <template v-for="o in schema.items">
            <v-list-item>
              {{ o.name }}
              <template #append>
                <v-btn
                  text="Edit"
                  @click="edit.set(o)"
                />
              </template>
            </v-list-item>
          </template>
        </v-list>
      </v-col>

      <v-col cols="9">
        <v-text-field v-model="edit.value.name" />
        <pre>{{ edit.value }}</pre>
        <v-btn
          text="save"
          @click="schema.save()"
        />
      </v-col>
    </v-row>
    <pre>{{ schema }}</pre>
  </div>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const $emit = defineEmits(["update:modelValue"]);

const model = reactive({
  value: $props.modelValue,
  emit() {
    $emit("update:modelValue", model.value);
  },
});

const schema = reactive({
  items: Object.entries(model.value.components.schemas).map(([name, data]) => ({
    name,
    data,
  })),
  save() {
    const data = Object.fromEntries(schema.items.map((o) => [o.name, o.data]));
    model.value.components.schemas = data;
    model.emit();
    console.log("schema.save");
  },
});

const edit = reactive({
  value: schema.items.at(0),
  set(value) {
    edit.value = value;
  },
});

watch(
  () => edit.value,
  () => {
    schema.save();
  },
  { deep: true }
);
</script>
