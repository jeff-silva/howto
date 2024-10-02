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

        <v-select
          label="Tema"
          v-model="game.theme"
          :hide-details="true"
          :items="[
            'Personagens de desenho animado',
            'Personagens de série',
            'Prato culinário',
          ]"
          @update:modelValue="game.init()"
        />

        <v-text-field
          label="Pergunta"
          v-model="game.quest"
          :hide-details="true"
          @keyup.enter="game.guess()"
        >
          <template #append-inner>
            <v-btn
              @click="game.guess()"
              :loading="game.aiGuess.busy"
              color="primary"
            >
              Responder
            </v-btn>
          </template>
        </v-text-field>

        <!-- <v-fade-transition>
          <v-alert
            type="error"
            v-if="ai.error"
          >
            <div v-html="ai.error"></div>
          </v-alert>
        </v-fade-transition> -->

        <v-card v-if="game.response">
          <v-card-text>
            <div
              class="ai-response"
              v-html="marked.parse(game.response)"
            ></div>
          </v-card-text>
        </v-card>

        <div class="d-flex justify-end ga-3">
          <!-- <v-btn
            text="Desisto"
            color="error"
            @click="rules.viewCharacter = !rules.viewCharacter"
          />
          <v-btn
            text="Mudar personagem"
            color="warning"
            @click="rules.characterChange()"
          /> -->
          <v-btn
            text="Tentar outro"
            :loading="game.aiInit.busy"
            @click="game.init()"
          />
        </div>

        <!-- <pre>game: {{ game }}</pre> -->
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

const game = reactive({
  theme: null,
  character: null,
  quest: "",
  try: 0,
  response: "",

  init() {
    this.quest = "";
    this.try = 0;
    // this.character = "Mickey Mouse";
    this.aiInit.prompt = `Para um jogo estilo Akinator, preciso que
      você me dê apenas o nome limpo (mais nada) de um ${this.theme}
      aleatório.

      Varie entre os anos 80 e hoje.

      Personagens secundários e terciários são bem vindos.

      Filmes também são muito bem vindos.
      
      Precisa ser algo famoso, para que não seja tão difícil
      de adivinhar, mas também não pode ser nada tão lógico Precisa ser desafiador.
      
      Se for o nome de um personagem e tiver sobrenome, informe-o.
      
      Se fizer parte de um filme ou série, informe também o nome da mesma
      nesse formato: Fulano - A Vida de Fulano
      
      Programas brasileiros que se passavam em canais abertos como Globo, SBT,
      TV Cultura e MTV são bem vindos.`;
    this.aiInit.submit().then((resp) => {
      resp.response.candidates.map((candidate) => {
        candidate.content.parts.map((part) => {
          this.character = part.text.trim();
        });
      });
    });
  },

  aiInit: useAi(),

  aiGuess: useAi(),

  guess() {
    this.aiGuess.options.context = `Isso é um jogo tipo Akinator,
      onde você vai ser um personagem e o usuário deve adivinhar quem é.

      As perguntas devem ser respondidas sobre o personagem hoje em dia
      (ou como estava antes de morrer, em caso de já ter morrido).

      As perguntas são feitas exclusivamente sobre o personagem, e não
      sobre o ator que o interpreta (caso tenha um).

      Atenção ao fato do personagem ser humano ou não. Constantemente
      é perguntado, por exemplo, se o Mickey é humano e você diz sim.
      Se é um animal, então não é humano.

      Responda apenas sim ou não. Se o usuário perguntar algo que não
      pode ser respondido com sim ou não, responda
      "Só posso responder sim ou não".

      Se o usuário adivinhar quem é você, dê uma resposta
      divertida comemorando por ele ter acertado, mencione também
      quantas tentativas ele levou para acertar.
      
      Você é ${this.character} e esta é a tentativa número ${this.try}.
    ---`;

    this.aiGuess.prompt = this.quest;
    this.quest = "";
    this.try++;

    this.aiGuess.submit().then((resp) => {
      resp.response.candidates.map((candidate) => {
        (candidate.content.parts || []).map((part) => {
          this.response = part.text.trim();
        });
      });
    });
  },
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
