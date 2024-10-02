<template>
  <div>
    <v-container style="max-width: 600px">
      <div class="d-flex flex-column ga-6">
        <v-alert>
          <v-alert-title>Jogo da adivinhação</v-alert-title>
          Faça perguntas à IA onde as respostas sejam apenas sim ou não para
          adivinhar o nome do personagem.
        </v-alert>

        <v-text-field
          label="Google AI Token"
          v-model="app.access.token"
          class="input-blur"
          :hide-details="true"
        >
          <template #append>
            <v-btn
              text="Token"
              target="_blank"
              href="https://aistudio.google.com/app/apikey"
            />
          </template>
        </v-text-field>

        <v-text-field
          label="Pergunta"
          v-model="ai.prompt"
          :hide-details="true"
          @keyup.enter="
            ai.submit();
            ai.prompt = '';
          "
        >
          <template #append-inner>
            <v-btn
              @click="ai.submit()"
              :loading="ai.busy"
              color="primary"
            >
              Responder
            </v-btn>
          </template>
        </v-text-field>

        <v-fade-transition>
          <v-alert
            type="error"
            v-if="ai.error"
          >
            <div v-html="ai.error"></div>
          </v-alert>
        </v-fade-transition>

        <v-card v-if="ai.response.candidates.length">
          <v-card-text>
            <template v-for="o in ai.response.candidates">
              <template v-for="oo in o.content.parts">
                <div
                  class="ai-response"
                  v-html="marked.parse(oo.text)"
                ></div>
              </template>
            </template>
          </v-card-text>
        </v-card>

        <v-fade-transition>
          <v-alert
            type="error"
            v-if="rules.viewCharacter"
            class="mb-4"
          >
            O personagem é {{ rules.character.name }}
          </v-alert>
        </v-fade-transition>

        <div class="d-flex justify-end ga-3">
          <v-btn
            text="Desisto"
            color="error"
            @click="rules.viewCharacter = !rules.viewCharacter"
          />
          <v-btn
            text="Mudar personagem"
            color="warning"
            @click="rules.characterChange()"
          />
        </div>

        <!-- <pre>rules: {{ rules }}</pre> -->
        <!-- <pre>ai: {{ ai }}</pre> -->
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { marked } from "marked";

const app = useApp();

const ai = useAi({
  appendHistory: false,
});

const rules = reactive({
  viewCharacter: false,
  character: null,
  characters: [
    { name: "Charlie Chaplin" },
    { name: "Buster Keaton" },
    { name: "Tarantino" },
    { name: "Mohamed Ali" },
    { name: "Bugs Bunny" },
  ],
  characterChange() {
    this.character =
      this.characters[Math.floor(Math.random() * this.characters.length)];
    ai.prompt = "";
    ai.contextUpdate(`
      Isso é um jogo. Você receberá várias perguntas tentando adivinhar quem você é.
      Responda apenas com sim ou não.
      As únicas exceções para essas respostas são:
      - Se o usuário fizer uma pergunta que não pode ser respondida com sim ou não, diga:
      "Só posso responder perguntas cuja resposta seja sim ou não".
      - Se o usuário acertar seu nome personagem. Então você parabeniza de uma forma alegre.
      Você é ${this.character.name}.
      ---
    `);
  },
});

rules.characterChange();
</script>

<style>
.ai-response {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ai-response pre code {
  display: block;
  background: indigo;
  color: #fff;
  padding: 10px 15px;
  border-radius: 5px;
}

.ai-response ul,
.ai-response ol {
  list-style: inside;
}

.input-blur .v-field__input {
  filter: blur(4px);
}
</style>
