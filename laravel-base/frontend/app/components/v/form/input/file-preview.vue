<template>
  <div
    v-if="file.value.url"
    class="bg-surface-light rounded-md overflow-hidden"
  >
    <template v-if="file.editor">
      <v-form-input-code
        v-model="file.editor.value"
        :language="file.editor.language"
        :max-height="$props.height"
      />
    </template>

    <template v-else-if="file.value.url && ['html', 'pdf'].includes(file.ext)">
      <iframe
        :src="file.value.url"
        :style="`border: none; width: 100%; height: ${heightComp};`"
      ></iframe>
    </template>

    <img
      v-else-if="file.type == 'image'"
      :src="file.value.url"
      alt=""
      :style="`width: 100%; height: ${heightComp}; object-fit: contain;`"
    />

    <video
      v-else-if="file.type == 'video'"
      controls
      autoplay
      muted
      :style="`width: 100%; height: ${heightComp};`"
    >
      <source
        :src="file.value.url"
        :type="file.value.mime"
      />
    </video>

    <div
      v-else-if="file.type == 'audio'"
      class="d-flex justify-center pa-3"
    >
      <audio
        controls
        class="w-full"
      >
        <source
          :src="file.value.url"
          :type="file.value.mime"
        />
      </audio>
    </div>

    <div
      v-else
      class="text-center py-4"
    >
      <div class="text-h5">{{ file.value.name }}</div>
      <div class="">{{ f.bytes(file.value.size) }}</div>
    </div>
  </div>
</template>

<script setup>
import _ from "lodash";
import mimel from "mime/lite";

const $props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  height: { type: [Number, String], default: 400 },
});

const heightComp = computed(() => {
  return isNaN($props.height) ? $props.height : $props.height + "px";
});

const f = useFormat();

const file = reactive({
  type: "unknown",
  editor: null,
  value: $props.modelValue,
  sync() {
    file.type = "unknown";
    file.editor = null;
    file.value = file.value || {};

    if (
      !file.value.mime &&
      file.value.url &&
      !file.value.url.startsWith("data:")
    ) {
      file.value.mime = mimel.getType(file.value.url);
    }

    if (!file.value.ext && file.value.mime) {
      file.value.ext = mimel.getExtension(file.value.mime);
    }

    if (!file.value.mime && file.value.ext) {
      file.value.mime = mimel.getType(file.value.ext);
    }

    if (file.value.mime) {
      file.type = file.value.mime.split("/").at(0) || "unknown";
    }

    const editorExts = ["json", "php", "html"];
    if (
      file.value.url &&
      file.value.ext &&
      file.value.url.startsWith("data:") &&
      (["text"].includes(file.type) || editorExts.includes(file.value.ext))
    ) {
      const [, , , , base64] = file.value.url.split(/(data:|;base64,)/);
      file.editor = {
        language: file.ext,
        value: atob(base64),
      };
    }
  },
});

file.sync();

watch(
  () => $props.modelValue,
  (modelValueNew) => {
    file.value = modelValueNew;
    file.sync();
  }
);
</script>
