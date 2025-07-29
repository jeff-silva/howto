<template>
  <v-dialog max-width="350">
    <template #activator="scope">
      <v-text-field
        prepend-inner-icon="material-symbols:alarm-on-outline"
        :model-value="model.valueFormatted()"
        readonly
        v-bind="{ ...$attrs, ...scope.props }"
      />
    </template>

    <template #default="scope">
      <v-card>
        <v-card-text>
          <v-date-picker
            :model-value="model.value"
            width="100%"
            @update:model-value="
              (value) => {
                model.setValue(value);
                model.emit();
              }
            "
          />
        </v-card-text>
        <div class="d-flex">
          <v-btn
            class="flex-grow-1"
            rounded="0"
            text="Limpar"
            @click="$emit('update:modelValue', null)"
          />
          <v-btn
            class="flex-grow-1"
            color="primary"
            rounded="0"
            text="Ok"
            @click="
              () => {
                scope.isActive.value = false;
                model.emit();
              }
            "
          />
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: [String, Date], default: null },
});

const $emit = defineEmits(["update:modelValue"]);

const model = reactive({
  value: null,
  setValue(value) {
    if (value instanceof Date) value = value.toISOString();
    model.value = value;
  },
  valueFormatted() {
    if (!model.value) return "";
    const [y, m, d, h, i, s] = model.value.split(/[^0-9]/g);
    return `${d}/${m}/${y}`;
  },
  emit() {
    $emit("update:modelValue", model.value);
  },
});

model.setValue($props.modelValue);

watch(
  () => $props.modelValue,
  (modelValue) => {
    model.value = modelValue;
  }
);
</script>
