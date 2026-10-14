<template>
  <div class="">
    <div class="pb-2 text-sm">{{ props.label }}</div>

    <div class="input validator w-full">
      <slot v-if="!!slots.prepend || props.prepend" name="prepend" v-bind="{ ...scope }">
        <div>{{ props.prepend }}</div>
      </slot>

      <slot name="default" v-bind="{ ...scope }">
        <input type="text" />
      </slot>
      
      <slot v-if="!!slots.append || props.append" name="append" v-bind="{ ...scope }">
        <div>{{ props.append }}</div>
      </slot>
    </div>

    <Teleport to="body">
      <dialog
        v-if="scope.open"
        :open="scope.open"
        class="modal"
        ref="dialogRef"
        @click.self="(ev) => {
          scope.dialogClose();
        }"
      >
        <div class="modal-box">
          <h3 v-if="!!props.dialogTitle" class="text-lg font-bold">
            {{ props.dialogTitle }}
          </h3>

          <div v-if="!!slots['dialog-body']" class="py-4">
            <slot name="dialog-body" v-bind="{ ...scope }">
              <!--  -->
            </slot>
          </div>


          <div class="modal-action">
            <slot name="dialog-actions" v-bind="{ ...scope }">
              <button class="btn" @click="scope.dialogClose()">Close</button>
            </slot>
          </div>
        </div>
      </dialog>
    </Teleport>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, default: '' },
  prepend: { type: String, default: null },
  append: { type: String, default: null },
  open: { type: Boolean, default: false },
  dialogTitle: { type: String, default: '' },
});

const emit = defineEmits([
  'dialog:open',
  'dialog:show',
  'dialog:close',
]);

const dialogRef = ref(null);
const slots = useSlots();

const scope = reactive({
  open: props.open,
  dialogClose() {
    scope.open = false;
    emit('dialog:close', { ...scope });
  },
  dialogShow() {
    scope.open = true;
    emit('dialog:open', { ...scope });
    emit('dialog:show', { ...scope });
  },
  dialogOpen() {
    return scope.dialogShow();
  },
  dialogFocus(target) {
    setTimeout(() => {
      if (!dialogRef.value) return;

      if (typeof target == 'string') {
        target = dialogRef.value.querySelector(target);
      }

      if (typeof target == 'undefined') {
        target = dialogRef.value;
      }
      
      target.focus();
    }, 1);
  },
});
</script>