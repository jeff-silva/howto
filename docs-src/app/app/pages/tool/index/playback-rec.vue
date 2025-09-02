<template>
  <div>
    <h2>Playback Rec</h2>
    <br />
    <v-stepper
      v-model="steps.value"
      :items="steps.items"
    >
      <v-stepper-header>
        <template v-for="o in items">
          <v-stepper-item v-bind="o"></v-stepper-item>
        </template>
      </v-stepper-header>

      <template v-slot:item.permission>
        <p>
          Primeiramente, vamos iniciar a aplicação. Apenas dê as permissões ao
          navegador para capturar imagens da sua webcam.
        </p>
        <br />

        <v-btn
          text="Permissão"
          @click="recorder.permissionInit()"
        />
      </template>

      <template v-slot:item.backtrack>
        <p>Agora, envie o arquivo de backtrack.</p>
        <br />
        <v-btn
          text="Backtrack"
          @click="recorder.backtrackInit()"
        />
      </template>

      <template v-slot:item.record>
        <div>Gravar</div>
      </template>
    </v-stepper>

    <pre>recorder: {{ recorder }}</pre>
    <pre>steps: {{ steps }}</pre>
  </div>
</template>

<script setup>
const steps = reactive({
  value: "permission",
  items: [
    {
      value: "permission",
      title: "Permissão",
      rules: [() => !!recorder.meta.mediaStream],
      completed: false,
    },
    {
      value: "backtrack",
      title: "Backtrack",
    },
    {
      value: "record",
      title: "Gravar",
    },
  ],
});

const recorder = reactive({
  meta: {
    mediaStream: null,
    backtrackFile: null,
  },
  async permissionInit() {
    recorder.meta.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (recorder.meta.mediaStream) {
      steps.value = "backtrack";
    }
  },
  async backtrackInit() {
    Object.assign(document.createElement("input"), {
      type: "file",
      onchange: (ev) => {
        recorder.meta.backtrackFile = ev.target.files[0] || null;
        if (recorder.meta.backtrackFile) {
          steps.value = "record";
        }
      },
    }).click();
  },
});
</script>
