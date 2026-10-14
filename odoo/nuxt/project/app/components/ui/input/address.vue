<template>
  <ui-input
    dialog-title="Editor de Endereço"
    v-bind="$attrs"
    @dialog:open="(ctx) => {
      ctx.dialogFocus('[data-focus]');
    }"
  >
    <template #default="ctx">
      <input type="text" placeholder="Endereço" :value="scope.formattedAddress" @focus="ctx.dialogOpen()"/>
    </template>

    <template #dialog-body="ctx">
      <div class="grid grid-cols-6 gap-4">
        <div class="col-span-6 bg-black opacity-20 rounded-md h-[200px]"></div>

        <ui-input class="col-span-6" prepend="Logradouro:">
          <input type="text" data-focus v-model="scope.value.route" @input="scope.emit()" />
        </ui-input>

        <ui-input class="col-span-3" prepend="Num.">
          <input type="text" v-model="scope.value.number" @input="scope.emit()" />
        </ui-input>

        <ui-input class="col-span-3" prepend="CEP">
          <input type="text" v-model="scope.value.zipcode" @input="scope.emit()" />
        </ui-input>

        <ui-input class="col-span-6" prepend="Complemento">
          <input type="text" v-model="scope.value.complement" @input="scope.emit()" />
        </ui-input>

        <ui-input class="col-span-3" prepend="Bairro">
          <input type="text" v-model="scope.value.district" @input="scope.emit()" />
        </ui-input>

        <ui-input class="col-span-3" prepend="Cidade">
          <input type="text" v-model="scope.value.city" @input="scope.emit()" />
        </ui-input>

        <ui-input class="col-span-3" prepend="Estado">
          <input type="text" v-model="scope.value.state" @input="scope.emit()" />
        </ui-input>

        <ui-input class="col-span-3" prepend="País">
          <input type="text" v-model="scope.value.country" @input="scope.emit()" />
        </ui-input>
      </div>

      <!-- <pre>{{ scope }}</pre> -->
    </template>
  </ui-input>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
});

const emit = defineEmits([
  'update:modelValue',
])

const scope = reactive({
  value: {
    route: '',
    number: '',
    zipcode: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    country: '',
    ...props.modelValue,
  },
  formattedAddress: computed(() => {
    const parts = [];
    if (scope.value.route) parts.push(scope.value.route);
    if (scope.value.number) parts.push(`No: ${scope.value.number}`);
    if (scope.value.district) parts.push(scope.value.district);
    if (scope.value.city) parts.push(scope.value.city);
    if (scope.value.state) parts.push(scope.value.state);
    return parts.join(', ');
  }),
  emit() {
    emit('update:modelValue', scope.value);
  },
});
</script>