<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-select
        v-model="$props.modelValue.type"
        :items="[
          { value: 'email', title: 'E-mail' },
          { value: 'phone', title: 'Telefone' },
        ]"
        label="Tipo de Contato"
        v-bind="$attrs"
        @update:model-value="$emit('update:modelValue', $props.modelValue)"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        v-model="$props.modelValue.value"
        label="Valor"
        v-bind="$attrs"
        @update:model-value="$emit('update:modelValue', $props.modelValue)"
      />
    </v-col>
  </v-row>
</template>

<script setup>
const $props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const $emit = defineEmits(["update:modelValue"]);
</script>
