<!-- eslint-disable @typescript-eslint/no-require-imports -->
<template>
  <div
    ref="monacoRef"
    style="min-height: 50px"
  ></div>
</template>

<script setup>
const $props = defineProps({
  modelValue: { type: String, default: "" },
  options: { type: Object, default: () => ({}) },
});

const $emit = defineEmits(["update:modelValue"]);

const monacoOptions = computed(() => {
  return {
    value: $props.modelValue,
    language: "javascript",
    theme: "vs-dark",
    minimap: { enabled: false },
    wordWrap: "off",
    automaticLayout: true,
    fontFamily: "monospace",
    scrollBeyondLastLine: false,
    lineHeight: 25,
    scrollbar: { alwaysConsumeMouseWheel: false },
    ...$props.options,
  };
});

const monacoRef = ref(null);
let editor;

const app = reactive({
  init(monaco) {
    editor = monaco.editor.create(monacoRef.value, monacoOptions.value);
    app.monacoResize();
    editor.onDidChangeModelContent(() => {
      $emit("update:modelValue", editor.getValue());
      app.monacoResize();
    });
  },
  monacoResize() {
    const opts = monacoOptions.value;
    const width = monacoRef.value.offsetWidth;
    const height = editor.getModel().getLineCount() * opts.lineHeight;
    editor.layout({ width, height });
  },
});

onMounted(() => {
  const i = setInterval(() => {
    if (typeof window.monaco == "undefined") return;
    clearInterval(i);
    app.init(window.monaco);
  }, 100);
});

watch(
  () => $props.modelValue,
  (modelValueNew) => {
    editor.setValue(modelValueNew);
  }
);

useHead({
  script: [
    {
      key: "monaco",
      src: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/loader.min.js",
      onload: () => {
        require.config({
          paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs",
          },
        });
        require(["vs/editor/editor.main"], () => {
          window.monaco = monaco;
        });
      },
    },
  ],
  link: [
    {
      key: "monaco",
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs/editor/editor.main.min.css",
    },
  ],
});
</script>
