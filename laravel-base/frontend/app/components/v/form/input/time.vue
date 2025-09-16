<template>
  <v-dialog max-width="350">
    <template #activator="scope">
      <v-text-field
        prepend-inner-icon="material-symbols:alarm-on-outline"
        :model-value="$props.modelValue"
        readonly
        v-bind="{ ...$attrs, ...scope.props }"
      />
    </template>

    <template #default="scope">
      <v-card>
        <v-card-text>
          <v-time-picker
            :model-value="$props.modelValue"
            width="100%"
            format="24hr"
            use-seconds
            @update:model-value="
              (value) => {
                $emit('update:modelValue', value);
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
                $emit('update:modelValue', $props.modelValue);
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
  modelValue: { type: String, default: null },
});

const $emit = defineEmits(["update:modelValue"]);
</script>
