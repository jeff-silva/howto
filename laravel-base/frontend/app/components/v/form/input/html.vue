<template>
  <v-input
    v-bind="$attrs"
    ref="rootRef"
  >
    <template #default="scope">
      <div class="flex-grow-1 border rounded">
        <div class="d-flex flex-wrap ga-2 bg-surface-light pa-1">
          <v-btn-group multiple>
            <v-btn
              icon="mdi-format-align-left"
              v-tooltip="'Alinhar esquerda'"
              @click="content.cmd('justifyLeft')"
            />
            <v-btn
              icon="mdi-format-align-center"
              v-tooltip="'Alinhar centro'"
              @click="content.cmd('justifyCenter')"
            />
            <v-btn
              icon="mdi-format-align-right"
              v-tooltip="'Alinhar direita'"
              @click="content.cmd('justifyRight')"
            />
            <v-btn
              icon="mdi-format-align-justify"
              v-tooltip="'Justificar'"
              @click="content.cmd('justifyFull')"
            />
          </v-btn-group>
          <v-btn-group multiple>
            <v-btn
              icon="mdi-format-bold"
              v-tooltip="'Negrito'"
              @click="content.cmd('bold')"
            />
            <v-btn
              icon="mdi-format-italic"
              v-tooltip="'Itálico'"
              @click="content.cmd('italic')"
            />
            <v-btn
              icon="mdi-format-underline"
              v-tooltip="'Sublinhado'"
              @click="content.cmd('underline')"
            />
          </v-btn-group>
          <v-btn-group multiple>
            <v-btn
              icon="material-symbols:code-blocks-outline"
              v-tooltip="'Código/HTML'"
              @click="
                () => {
                  content.type = content.type == 'html' ? 'code' : 'html';
                  content.setValue(content.value, true);
                }
              "
            />
          </v-btn-group>
        </div>
        <div
          contenteditable
          class="pa-2"
          :style="
            (() => {
              if (content.type == 'code') {
                return {
                  maxHeight: '0',
                  overflow: 'hidden',
                  padding: '0 !important',
                };
              }
              return {
                outline: 'none !important',
                minHeight: '150px',
              };
            })()
          "
          ref="contentEditableRef"
          @keyup="
            content.caretSync();
            content.setValue($event.target.innerHTML, false);
          "
          @click="content.caretSync()"
        ></div>
        <v-form-input-code
          v-if="content.type == 'code'"
          :model-value="content.value"
          @update:modelValue="
            (value) => {
              content.setValue(value);
            }
          "
        />
      </div>
    </template>
  </v-input>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: "" },
  errorMessages: { type: Array, default: () => [] },
  config: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["update:modelValue", "init"]);

const rootRef = ref(null);
const contentEditableRef = ref(null);

const content = reactive({
  value: props.modelValue,
  type: "html",
  setValue(value, setInnerHtml = false) {
    content.value = value;

    setTimeout(() => {
      if (!setInnerHtml) return;
      if (!contentEditableRef.value) return;
      if (contentEditableRef.value.contains(document.activeElement)) return;
      contentEditableRef.value.innerHTML = value;
      content.parseContent();
    }, 10);

    emit("update:modelValue", content.value);
  },
  getValue() {
    return content.value;
  },
  cmd(commandId, showUi = false, value = null) {
    document.execCommand(commandId, showUi, value);
    const contentValue = contentEditableRef.value.innerHTML;
    emit("update:modelValue", contentValue);
  },
  parseContent() {},
  caret: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  caretSync() {
    let sel = window.getSelection();
    if (sel.rangeCount) {
      let range = sel.getRangeAt(0).cloneRange();
      if (range.getClientRects()) {
        range.collapse(true);
        content.caret = range.getClientRects()[0];
      }
    }
  },
});

watch(
  () => props.modelValue,
  (modelValue) => {
    content.setValue(modelValue, true);
  }
);

onMounted(() => {
  content.setValue(props.modelValue, true);
});
</script>
