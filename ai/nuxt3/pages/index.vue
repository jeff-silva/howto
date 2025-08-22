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
            'Personagens de série',
            'Personagens de desenho animado',
            'Personagens de anime',
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
            text="Desistir"
            @click="
              () => {
                game.giveUp();
              }
            "
          />
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
const _alert = alert;

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
    this.aiInit.prompt = `
      Para um jogo de adivinhação de personagem, me dê o nome de ${this.theme}, apenas um.
      Preciso somente do nome como resposta, mais nada.

      Regras:

      - Seja criativo e aleatório, você repete muito personagens de Braking Bad;

      - O personagem precisa ser conhecido;

      - Não precisa ser o personagem principal, só precisa ser conhecido;

      - Informe o sobrenome, se o mesmo existir;

      - Detalhe de onde vem o personagem, nesse formato de exemplo: "Fulano - A Vida de Fulano"

      - Os programas podem ser de qualquer país do mundo, só é importante o personagem ser conhecido;
    `;
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
    this.aiGuess.options.context = `
      Estamos em um jogo onde você é um personagem secreto e
      é preciso adivinhar quem você é.

      - As perguntas só podem ser respondidas com sim ou não, mais nada.

      - Se for perguntado algo onde "sim" e "não" não caibam como resposta,
      diga apenas: "Só posso responder sim ou não."

      - Se o usuário disser "desisto", diga o nome do personagem e informe
      que a pessoa perdeu o jogo.

      As perguntas são feitas exclusivamente sobre o personagem, e não
      sobre o ator que o interpreta (caso tenha um).

      - Perguntas sobre o personagem ser um humano, fazem referência ao fato de ele ser ou não baseado em um animal.
      Personagens baseados em animais não são humanos.

      - Se o usuário adivinhar quem é você, dê uma resposta
      divertida comemorando por ele ter acertado, mencione também
      quantas tentativas ele levou para acertar.
      
      Você é ${this.character} e esta é a tentativa número ${this.try}.
      ---
    `;

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

  giveUp() {
    alert(`O personagem é ${game.character}`);
    game.init();
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
