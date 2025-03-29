<template>
  <v-menu
    max-width="500"
    :close-on-content-click="false"
  >
    <template #activator="scope">
      <v-text-field
        v-bind="scope.props"
        v-model="$props.modelValue.name"
        readonly
        @update:model-value="modelValueEmit()"
      />
    </template>

    <v-card>
      <v-card-text>Endereço</v-card-text>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <v-text-field
              v-model="$props.modelValue.zipcode"
              label="CEP"
              v-bind="$attrs"
              @update:model-value="modelValueEmit()"
            />
          </v-col>

          <v-col
            cols="12"
            md="8"
          >
            <v-text-field
              v-model="$props.modelValue.route"
              label="Rua"
              v-bind="$attrs"
              @update:model-value="modelValueEmit()"
            />
          </v-col>

          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="$props.modelValue.number"
              label="Número"
              v-bind="$attrs"
              @update:model-value="modelValueEmit()"
            />
          </v-col>

          <v-col
            cols="12"
            md="12"
          >
            <v-text-field
              v-model="$props.modelValue.complement"
              label="Complemento"
              v-bind="$attrs"
              @update:model-value="modelValueEmit()"
            />
          </v-col>

          <v-col
            cols="12"
            md="12"
          >
            <v-text-field
              v-model="$props.modelValue.neighborhood"
              label="Bairro"
              v-bind="$attrs"
              @update:model-value="modelValueEmit()"
            />
          </v-col>

          <v-col
            cols="12"
            md="12"
          >
            <v-text-field
              v-model="$props.modelValue.city"
              label="Cidade"
              v-bind="$attrs"
              @update:model-value="modelValueEmit()"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="$props.modelValue.state"
              label="Estado"
              v-bind="$attrs"
              @update:model-value="modelValueEmit()"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="$props.modelValue.country"
              label="País"
              v-bind="$attrs"
              @update:model-value="modelValueEmit()"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup>
const $props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const $emit = defineEmits(["update:modelValue"]);

const modelValueEmit = () => {
  $emit("update:modelValue", $props.modelValue);
};
</script>
