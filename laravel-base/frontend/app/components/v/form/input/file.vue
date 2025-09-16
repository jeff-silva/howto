<template>
  <div>
    <v-defaults-provider
      :defaults="{ VBtn: { density: 'compact', variant: 'text' } }"
    >
      <v-text-field
        :model-value="file.value.name || file.value.url"
        v-bind="{ ...$attrs, type: 'text' }"
      >
        <template #prepend-inner>
          <div class="d-flex ga-2 pe-3">
            <v-btn
              icon="mdi-upload"
              @click="
                () => {
                  dialog.toggle();
                  if (!file.value.url) {
                    file.browse();
                  }
                }
              "
            />
          </div>
        </template>

        <template #append-inner>
          <div class="d-flex ga-2 ps-3">
            <div style="white-space: nowrap">
              {{ bytesToHuman(file.value.size) }}
            </div>
            <v-btn
              v-if="file.value.url"
              icon="mdi-delete"
              @click="
                file.setValue({});
                file.emit();
              "
            />
          </div>
        </template>
      </v-text-field>
    </v-defaults-provider>

    <v-dialog
      v-model="dialog.value"
      max-width="600"
      scrollable
    >
      <v-card title="Upload">
        <v-card-text>
          <v-text-field
            label="Nome"
            v-model="file.value.name"
          />

          <div
            v-if="file.value.url"
            class="bg-surface-light rounded-md overflow-hidden"
          >
            <v-form-input-file-preview
              v-model="file.value"
              :height="$props.previewHeight"
            />

            <v-defaults-provider :defaults="{ VBtn: { density: 'compact' } }">
              <div class="d-flex justify-end ga-2 pa-2 bg-surface ma-1 rounded">
                <v-btn
                  text="Delete"
                  class="bg-error"
                  prepend-icon="mdi-delete"
                  @click="
                    file.setValue({});
                    file.emit();
                  "
                />
                <v-btn
                  v-if="file.value.url"
                  text="Download"
                  prepend-icon="mdi-download"
                  @click="file.download()"
                />
                <v-btn
                  text="Upload"
                  prepend-icon="mdi-upload"
                  @click="file.browse()"
                />
              </div>
            </v-defaults-provider>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Fechar"
            class="bg-primary"
            @click="dialog.toggle()"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import _ from "lodash";
import mimel from "mime/lite";

const $props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  previewHeight: { type: [Number, String], default: 400 },
});

const $emit = defineEmits(["update:modelValue"]);

const bytesToHuman = (size) => {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};

const random = reactive({
  value: null,
  generate() {
    random.value = Math.random().toString(36).substring(2, 15);
  },
});

const dialog = reactive({
  value: false,
  toggle(value = null) {
    dialog.value = value === null ? !dialog.value : value;
  },
});

const file = reactive({
  ext: "",
  type: "unrecognized",
  codeEditor: null,
  value: {},

  emit() {
    $emit("update:modelValue", file.value);
  },

  async setValue(value) {
    file.value = {
      name: "",
      url: "",
      mime: "",
      size: 0,
      ...(value || {}),
    };

    await file.sync();
  },

  async sync() {
    file.value.mime = file.value.mime || "";
    file.value.url = file.value.url || "";
    file.codeEditor = null;

    if (
      file.value.url &&
      !file.value.url.startsWith("data:") &&
      !file.value.mime
    ) {
      file.value.mime = mimel.getType(file.value.url);
    }

    if (file.value.url.startsWith("data:") && !file.value.mime) {
      const [, , mime, ,] = file.value.url.split(/(data:|;base64,)/);
      file.value.mime = mime || "unknown";
    }

    file.type = file.value.mime.split("/").at(0) || "unknown";
    file.ext = file.value.name
      ? file.value.name.split(".").pop()
      : mimel.getExtension(file.value.mime);

    if (
      file.value.url.startsWith("data:") &&
      (["text"].includes(file.type) || ["json", "php"].includes(file.ext))
    ) {
      const [, , , , base64] = file.value.url.split(/(data:|;base64,)/);
      file.codeEditor = {
        language: file.ext,
        value: atob(base64),
      };
    }

    if (file.type == "image") {
      Object.assign(document.createElement("img"), {
        src: file.value.url,
        onload(ev) {
          file.value.width = ev.target.width;
          file.value.height = ev.target.height;
        },
      });
    } else if (file.type == "audio") {
      Object.assign(document.createElement("audio"), {
        src: file.value.url,
        onloadedmetadata(ev) {
          file.value.duration = ev.target.duration;
        },
      });
    } else if (file.type == "video") {
      Object.assign(document.createElement("video"), {
        src: file.value.url,
        onloadedmetadata(ev) {
          file.value.duration = ev.target.duration;
        },
      });
    }
  },

  browse() {
    Object.assign(document.createElement("input"), {
      type: "file",
      onchange: (ev) => {
        const f = ev.target.files[0];
        Object.assign(new FileReader(), {
          onloadend(ev) {
            const ext = f.name.split(".").pop();
            file.setValue({
              url: ev.target.result,
              mime: f.type,
              size: f.size,
              name: f.name,
              ext,
            });
            file.emit();
          },
        }).readAsDataURL(f);
      },
    }).click();
  },

  download() {
    let downloadName = new Date().toISOString() + `.${file.ext}`;
    downloadName = downloadName.replace(/(-|:)/g, "");
    downloadName = downloadName.replace(/T/g, ".");
    Object.assign(document.createElement("a"), {
      href: file.value.url,
      download: downloadName,
      target: "_blank",
    }).click();
  },
});

file.setValue($props.modelValue);

watch(
  () => $props.modelValue,
  (modelValueNew) => {
    file.setValue(modelValueNew);
  }
);
</script>
