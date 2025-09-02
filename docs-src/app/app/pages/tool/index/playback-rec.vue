<template>
  <div>
    <h2>Playback Rec</h2>
    <br />
    <!-- <v-stepper
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
          @click="recorder.backtrackSelect()"
        />
      </template>

      <template v-slot:item.record>
        <audio
          ref="audioRef"
          controls
          :src="recorder.meta.backtrackUrl"
        ></audio>

        <video
          v-if="recorder.meta.recordedVideoUrl"
          :src="recorder.meta.recordedVideoUrl"
          controls
        ></video>

        <div>Gravar</div>
      </template>
    </v-stepper> -->

    <v-btn
      v-if="!recorder.meta.backtrackUrl"
      text="Selecionar Backtrack"
      @click="recorder.backtrackSelect()"
    />

    <video
      ref="videoRef"
      autoplay
    ></video>

    <audio
      v-if="recorder.meta.backtrackUrl"
      ref="audioRef"
      controls
      :src="recorder.meta.backtrackUrl"
    ></audio>

    <video
      v-if="recorder.meta.recordedVideoUrl"
      ref="recordedRef"
      :src="recorder.meta.recordedVideoUrl"
      controls
    ></video>

    <v-btn
      v-if="!recorder.meta.multiStreamRecorder"
      text="Iniciar Gravação"
      @click="recorder.recordStart()"
    />

    <v-btn
      v-if="recorder.meta.multiStreamRecorder"
      text="Parar Gravação"
      @click="recorder.recordStop()"
    />

    <pre>recorder: {{ recorder }}</pre>
    <pre>steps: {{ steps }}</pre>
  </div>
</template>

<script setup>
import { MultiStreamRecorder } from "recordrtc";

const audioRef = ref(null);
const videoRef = ref(null);
const recordedRef = ref(null);

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
    backtrackUrl: null,
    recordedVideoUrl: null,
    mediaRecorder: null,
    multiStreamRecorder: null,
  },
  async permissionInit() {
    videoRef.value.srcObject = recorder.meta.mediaStream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    return recorder.meta.mediaStream;
  },
  async backtrackSelect() {
    await recorder.permissionInit();
    Object.assign(document.createElement("input"), {
      type: "file",
      onchange: (ev) => {
        if (ev.target.files[0]) {
          recorder.meta.backtrackUrl = URL.createObjectURL(ev.target.files[0]);
        }
      },
    }).click();
  },
  async recordStart() {
    audioRef.value.play();

    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const combined = new MediaStream();
    recorder.meta.mediaStream
      .getVideoTracks()
      .forEach((t) => combined.addTrack(t));

    const audioCtx = new AudioContext();
    const destination = audioCtx.createMediaStreamDestination();
    const mixedAudioStream = destination.stream;
    mixedAudioStream.getAudioTracks().forEach((t) => combined.addTrack(t));

    const aaa = new MediaStreamRecorder(combined, {
      mimeType: "video/webm;codecs=vp8,opus",
    });

    // const chunks = [];
    // mediaRecorder.ondataavailable = (ev) => {
    //   if (ev.data && ev.data.size) chunks.push(ev.data);
    // };

    // mediaRecorder.onstop = () => {
    //   recorder.meta.recordedVideoUrl = URL.createObjectURL(
    //     new Blob(chunks, {
    //       type: "video/webm",
    //     })
    //   );
    // };
  },

  recordStop() {
    recorder.meta.multiStreamRecorder.stop((blob) => {
      console.log(blob);
    });
  },
});
</script>
