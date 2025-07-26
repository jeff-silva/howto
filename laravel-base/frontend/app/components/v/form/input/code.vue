<!--
  yarn add -D monaco-editor emmet

  Monaco options:
  https://microsoft.github.io/monaco-editor/typedoc/variables/editor.EditorOptions.html
-->

<template>
  <div
    ref="editorRef"
    class="v-code bg-blue-grey-darken-4"
    style="width: 100%; height: auto"
  ></div>
</template>

<script setup>
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/xml/xml.contribution";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "monaco-editor/esm/vs/basic-languages/sql/sql.contribution";
import "monaco-editor/esm/vs/basic-languages/scss/scss.contribution";
import "monaco-editor/esm/vs/basic-languages/php/php.contribution";
import "monaco-editor/esm/vs/basic-languages/shell/shell.contribution";
import "monaco-editor/esm/vs/language/json/monaco.contribution";

monaco.editor.defineTheme("custom", {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      token: "identifier",
      foreground: "9CDCFE",
    },
    {
      token: "identifier.function",
      foreground: "DCDCAA",
    },
    {
      token: "type",
      foreground: "1AAFB0",
    },
  ],
  colors: {
    "editor.background": "#00000000",
    "editor.lineHighlightBorder": "#00000000",
  },
});

import emmet from "emmet";

const props = defineProps({
  modelValue: { type: String, default: "" },
  theme: { type: String, default: "custom" },
  language: { type: String, default: "html" },
  disabled: { type: Boolean, default: false },
  lineHeight: { type: Number, default: 30 },
  minHeight: { type: Number, default: null },
  maxHeight: { type: Number, default: null },
});

const emit = defineEmits(["update:modelValue"]);

let editor;
const editorRef = ref(null);

watch([props], ([propsNew]) => {
  if (editorRef.value.contains(document.activeElement)) return;
  if (editor) {
    editor.setValue(propsNew.modelValue);
    setTimeout(monacoResize, 1);
  }
});

const monacoResize = () => {
  const minHeight = props.lineHeight * 0;
  // if (editorRef.value.style.height == "100%") return;
  const width = editorRef.value.offsetWidth;
  // const height = editor.getContentHeight();
  let height = Math.max(
    minHeight,
    editor.getModel().getLineCount() * props.lineHeight
  );
  if (props.minHeight !== null) height = Math.max(height, props.minHeight);
  if (props.maxHeight !== null) height = Math.min(height, props.maxHeight);
  editor.layout({ width, height });
  // editorRef.value.style.height = `${height}px`;
};

onMounted(() => {
  editor = monaco.editor.create(editorRef.value, {
    value: props.modelValue,
    readOnly: props.disabled,
    theme: props.theme,
    language: props.language,
    minimap: { enabled: false },
    wordWrap: "off",
    automaticLayout: true,
    fontFamily: "monospace",
    scrollBeyondLastLine: false,
    lineHeight: props.lineHeight,
    scrollbar: { alwaysConsumeMouseWheel: false },
    // ...props,
  });

  editor.onDidChangeModelContent(() => {
    emit("update:modelValue", editor.getValue());
    monacoResize();
  });

  editor.addCommand(monaco.KeyCode.Tab, () => {
    const word = editor._modelData.model
      .getValueInRange({
        ...editor.getSelection(),
        startColumn: 1,
      })
      .split(/[^a-zA-Z0-9]/)
      .at(-1);
    const pos = editor.getPosition();
    const text = emmet(word) || `\t`;
    const range = new monaco.Range(
      pos.lineNumber,
      pos.column - word.length,
      pos.lineNumber,
      pos.column
    );
    editor.executeEdits("", [
      {
        identifier: { major: 1, minor: 1 },
        range,
        text,
        forceMoveMarkers: true,
      },
    ]);
  });

  nextTick(async () => {
    setTimeout(monacoResize, 1);
  });
});

// watch example: editor.updateOptions({ readOnly: true })
</script>

<style>
.v-code * {
  font-family: monospace !important;
}
</style>
