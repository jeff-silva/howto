<template>
  <div
    ref="monacoRef"
    class="app-monaco"
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
    app.themeInit();
  },
  monacoResize() {
    const opts = monacoOptions.value;
    const width = monacoRef.value.offsetWidth;
    const height = editor.getModel().getLineCount() * opts.lineHeight;
    editor.layout({ width, height });
  },

  // https://github.com/brijeshb42/monaco-themes/blob/master/themes/themelist.json
  themes: {
    active4d: "Active4D",
    "all-hallows-eve": "All Hallows Eve",
    amy: "Amy",
    "birds-of-paradise": "Birds of Paradise",
    blackboard: "Blackboard",
    "brilliance-black": "Brilliance Black",
    "brilliance-dull": "Brilliance Dull",
    "chrome-devtools": "Chrome DevTools",
    "clouds-midnight": "Clouds Midnight",
    clouds: "Clouds",
    cobalt: "Cobalt",
    cobalt2: "Cobalt2",
    dawn: "Dawn",
    dracula: "Dracula",
    dreamweaver: "Dreamweaver",
    eiffel: "Eiffel",
    "espresso-libre": "Espresso Libre",
    "github-dark": "GitHub Dark",
    "github-light": "GitHub Light",
    github: "GitHub",
    idle: "IDLE",
    katzenmilch: "Katzenmilch",
    "kuroir-theme": "Kuroir Theme",
    lazy: "LAZY",
    "magicwb--amiga-": "MagicWB (Amiga)",
    "merbivore-soft": "Merbivore Soft",
    merbivore: "Merbivore",
    "monokai-bright": "Monokai Bright",
    monokai: "Monokai",
    "night-owl": "Night Owl",
    nord: "Nord",
    "oceanic-next": "Oceanic Next",
    "pastels-on-dark": "Pastels on Dark",
    "slush-and-poppies": "Slush and Poppies",
    "solarized-dark": "Solarized-dark",
    "solarized-light": "Solarized-light",
    spacecadet: "SpaceCadet",
    sunburst: "Sunburst",
    "textmate--mac-classic-": "Textmate (Mac Classic)",
    "tomorrow-night-blue": "Tomorrow-Night-Blue",
    "tomorrow-night-bright": "Tomorrow-Night-Bright",
    "tomorrow-night-eighties": "Tomorrow-Night-Eighties",
    "tomorrow-night": "Tomorrow-Night",
    tomorrow: "Tomorrow",
    twilight: "Twilight",
    "upstream-sunburst": "Upstream Sunburst",
    "vibrant-ink": "Vibrant Ink",
    "xcode-default": "Xcode_default",
    zenburnesque: "Zenburnesque",
    iplastic: "iPlastic",
    idlefingers: "idleFingers",
    krtheme: "krTheme",
    monoindustrial: "monoindustrial",
  },

  themeInit() {
    const theme = app.themes[monacoOptions.value.theme] || null;
    if (!theme) return;
    fetch(
      `https://raw.githubusercontent.com/brijeshb42/monaco-themes/refs/heads/master/themes/${theme}.json`
    ).then(async (resp) => {
      const themeData = await resp.json();
      monaco.editor.defineTheme("custom", themeData);
      monaco.editor.setTheme("custom");
    });
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

<style>
.app-monaco .monaco-editor {
  outline: none !important;
}
</style>
