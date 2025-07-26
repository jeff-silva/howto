<template>
  <v-menu
    :close-on-content-click="false"
    max-width="300"
    offset="10"
  >
    <template #activator="scope">
      <v-text-field
        aprepend-inner-icon="ic:sharp-color-lens"
        :model-value="props.modelValue"
        v-bind="{ ...$attrs, ...scope.props }"
      >
        <template #prepend-inner>
          <v-sheet
            :color="props.modelValue"
            class="pa-2 ms-n3 me-2"
            rounded="sm"
          >
            <v-icon icon="ic:sharp-color-lens" />
          </v-sheet>
        </template>
      </v-text-field>
    </template>

    <v-card>
      <v-color-picker
        :model-value="props.modelValue"
        @update:model-value="
          (color) => {
            emit('update:modelValue', color);
          }
        "
      />
      <v-btn
        block
        text="Limpar"
        @click="emit('update:modelValue', null)"
      />
    </v-card>
  </v-menu>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: null },
});

const emit = defineEmits(["update:modelValue"]);
</script>
