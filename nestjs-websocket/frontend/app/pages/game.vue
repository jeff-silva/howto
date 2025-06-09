<template>
  <div>
    <div v-if="game.state">
      <nuxt-link to="/">Sair Jogo</nuxt-link>
      <br />
      <button
        v-if="!game.client.ready && game.state.step === 'ready_to_play'"
        type="button"
        @click="game.emitPlayerReady()"
      >
        Estou pronto
      </button>

      <table v-if="game.state.step == 'playing'">
        <tbody>
          <template v-for="n in ['1', '2', '3']">
            <tr>
              <template v-for="l in ['A', 'B', 'C']">
                <td>
                  <button
                    :disabled="
                      game.state.playerTurn.id != game.client.id ||
                      !!game.state.slots[l + n]
                    "
                    @click="game.emitPlayerMove(l + n)"
                  >
                    {{ game.state.slots[l + n] || "-" }}
                  </button>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <br />
    <pre>{{ game }}</pre>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";

const useGame = () => {
  const game = reactive({
    client: null,
    state: null,

    disconnect() {
      socket.disconnect();
    },

    emitUpdate() {
      socket.emit("state", game.state);
    },

    emitPlayerReady() {
      socket.emit("playerReady");
    },

    emitPlayerMove(id) {
      socket.emit("playerMove", id);
    },

    gameStart() {
      game.state.step = "playing";
    },

    getSymbol(id) {
      const clientId = game.state.slots[id] || null;
      if (!clientId) return "--";

      const symbol = game.state.symbols[clientId] || null;
      return symbol;
      if (!symbol) return "--";

      return symbol;
    },
  });

  const socket = io("http://localhost:3000", {});

  socket.on("client", (client) => {
    game.client = client;
  });

  socket.on("state", (state) => {
    game.state = state;
  });

  return game;
};

const game = useGame();

onUnmounted(() => {
  game.disconnect();
});
</script>
