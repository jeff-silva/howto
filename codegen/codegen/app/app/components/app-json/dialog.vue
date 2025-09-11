<template>
  <v-dialog
    v-model="$props.modelValue.visible"
    v-bind="$props.dialogBind"
  >
    <v-card :title="$props.title">
      <v-card-text v-bind="$props.textBind">
        <slot></slot>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-ext-form-actions
          :actions="[
            ...$props.actions,
            {
              text: 'Fechar',
              onClick() {
                $props.modelValue.toggle();
              },
            },
          ]"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  title: { type: String, default: null },
  actions: { type: Array, default: () => [] },
  dialogBind: {
    type: Object,
    default: () => ({ maxWidth: 600, scrollable: true }),
  },
  textBind: {
    type: Object,
    default: () => ({ maxWidth: 600, scrollable: true }),
  },
});
</script>
