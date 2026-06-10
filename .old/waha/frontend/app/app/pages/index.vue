<template>
  <div>
    <v-btn
      text="Enviar mensagem"
      :loading="sendMessage.busy"
      @click="sendMessage.submit()"
    />
    <v-btn
      text="Enviar audio"
      :loading="sendVoice.busy"
      @click="sendVoice.submit()"
    />
    <pre>{{ sendVoice }}</pre>
  </div>
</template>

<script setup>
const sendMessage = useAxios({
  method: "post",
  url: "http://localhost:3000/api/sendText",
  data: {
    chatId: "553195271426@c.us",
    reply_to: null,
    text: "Text",
    linkPreview: true,
    linkPreviewHighQuality: false,
    session: "default",
  },
  onSubmit() {
    sendMessage.data.text = `Mensagem aleatória ${Math.round(
      Math.random() * 9999
    )}`;
  },
});

const sendVoice = useAxios({
  method: "post",
  url: "http://localhost:3000/api/sendVoice",
  data: {
    session: "default",
    chatId: "553195271426@c.us",
    file: {
      mimetype: "audio/ogg; codecs=opus",
      url: "https://github.com/devlikeapro/waha/raw/core/examples/dev.likeapro.opus",
    },
  },
  onSubmit() {
    sendMessage.data.text = `Mensagem aleatória ${Math.round(
      Math.random() * 9999
    )}`;
  },
});

// const act = reactive({
//   async sendMessage() {
//     const data = {
//       chatId: "11111111111@c.us",
//       reply_to: null,
//       text: "Hi there!",
//       linkPreview: true,
//       linkPreviewHighQuality: false,
//       session: "default",
//     };

//     console.log("sendMessage", { data });
//   },
// });
</script>
