<template>
  <div>
    <component
      :is="comp.is"
      v-bind="{ ...$attrs, ...$props }"
      :model-value="$props.modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
const $emit = defineEmits(["update:modelValue"]);

const $props = defineProps({
  modelValue: {
    type: [Boolean, Number, String, Array, Object, Function],
    default: null,
  },
  type: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
});

const comp = reactive({
  is: computed(() => {
    return types[$props.type] ? types[$props.type].component : "div";
  }),
});
</script>

<script>
import text from "./text.vue";
import password from "./password.vue";
import textarea from "./textarea.vue";
import color from "./color.vue";
import cpf from "./cpf.vue";
import cnpj from "./cnpj.vue";
import money from "./money.vue";
import phone from "./phone.vue";
import tags from "./tags.vue";
import file from "./file.vue";
import filePreview from "./file-preview.vue";
import html from "./html.vue";
import code from "./code.vue";
import date from "./date.vue";
import time from "./time.vue";
import datetime from "./datetime.vue";
import address from "./address.vue";

export const types = Object.fromEntries(
  Object.entries({
    text: { name: "Texto", return: "string", component: text },
    password: { name: "Senha", return: "string", component: password },
    textarea: {
      name: "Texto multilinha",
      return: "string",
      component: textarea,
    },
    color: { name: "Cor", return: "string", component: color },
    cpf: { name: "CPF", return: "string", component: cpf },
    cnpj: { name: "CNPJ", return: "string", component: cnpj },
    money: { name: "Dinheiro", return: "string", component: money },
    phone: { name: "Telefone", return: "string", component: phone },
    tags: { name: "Tags", return: "array", component: tags },
    file: { name: "Arquivo", return: "object", component: file },
    filePreview: {
      name: "Arquivo Preview",
      return: "object",
      component: filePreview,
    },
    html: { name: "HTML", return: "string", component: html },
    code: { name: "Código", return: "string", component: code },
    date: { name: "Data", return: "string", component: date },
    time: { name: "Hora", return: "string", component: time },
    datetime: { name: "Data e hora", return: "string", component: datetime },
    address: { name: "Endereço", return: "object", component: address },
  }).map(([type, item]) => {
    item.type = type;
    return [type, item];
  })
);
</script>
