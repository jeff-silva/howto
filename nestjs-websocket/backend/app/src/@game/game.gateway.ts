/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  players: Map<string, any> = new Map();

  slotsDefault = {
    A1: null,
    A2: null,
    A3: null,
    B1: null,
    B2: null,
    B3: null,
    C1: null,
    C2: null,
    C3: null,
  };

  state: Record<string, any> = {
    step: 'waiting_players',
    alert: { type: 'warning', message: '' },
    players: {},
    playerTurn: null,
    playerWin: null,
    slots: { ...this.slotsDefault },
    symbols: {},
  };

  afterInit(server: Server) {
    console.log('afterInit', { server });
  }

  handleConnection(client: any) {
    const clientData = {
      id: client.id,
      name: `Player ${client.id.slice(0, 5)}`,
      ready: false,
    };
    this.players.set(client.id, clientData);
    client.emit('client', clientData);
    this.update();
  }

  handleDisconnect(client: any) {
    this.players.delete(client.id);
    this.state.playerTurn = null;
    this.state.playerWin = null;
    this.state.slots = { ...this.slotsDefault };
    this.update();
  }

  @SubscribeMessage('state')
  onState(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Record<string, any>,
  ): Record<string, any> {
    this.state = { ...this.state, ...data };
    return data;
  }

  @SubscribeMessage('playerReady')
  onPlayerReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Record<string, any>,
  ): Record<string, any> {
    const clientData = this.players.get(client.id);
    clientData.ready = true;
    client.emit('client', clientData);
    this.update();
    return data;
  }

  @SubscribeMessage('playerMove')
  onPlayerMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: string,
  ): string {
    const clientData = this.players.get(client.id);
    if (typeof this.state.slots[id] == 'undefined') return id;
    const symbol = this.state.symbols[clientData.id];
    this.state.slots[id] = symbol;

    // Verify if there is a winner
    const wins = [
      ['A1', 'A2', 'A3'],
      ['B1', 'B2', 'B3'],
      ['C1', 'C2', 'C3'],
      ['A1', 'B1', 'C1'],
      ['A2', 'B2', 'C2'],
      ['A3', 'B3', 'C3'],
      ['A1', 'B2', 'C3'],
      ['A3', 'B2', 'C1'],
    ];

    const areAllValuesSame = (values) => {
      values = values.map((id) => this.state.slots[id]);
      if (values.length <= 2) return false;
      const first = values[0];
      if (first === null) return false;
      return values.every((value) => value === first);
    };

    wins.map((seqs) => {
      if (!areAllValuesSame(seqs)) return;
      this.state.playerWin = this.state.playerTurn;
      this.state.step = 'game_over';
      this.state.alert.type = 'success';
      this.state.alert.message = `Player ${this.state.playerWin.name} won!`;
    });

    if (!this.state.playerWin) {
      this.state.playerTurn = Array.from(this.players.values()).find(
        (o) => o.id != this.state.playerTurn.id,
      );
    }

    this.update();
    return id;
  }

  update() {
    this.state.players = Object.fromEntries(this.players.entries());
    const playersArray = Array.from(this.players.values());

    this.state.alert.type = 'warning';
    this.state.alert.message = '';
    this.state.symbols = {};

    if (this.players.size < 2) {
      this.state.alert.type = 'warning';
      this.state.alert.message = 'Precisamos de 2 jogadores';
      this.state.step = 'waiting_players';
    }

    if (this.players.size == 2) {
      if (this.state.step == 'waiting_players') {
        this.state.alert.type = 'success';
        this.state.alert.message = 'O jogo pode começar!';
        this.state.step = 'ready_to_play';
      }

      // Verify is all players are ready
      if (playersArray.every((p) => p.ready)) {
        this.state.step = 'playing';
        playersArray.map((player, index) => {
          this.state.symbols[player.id] = index === 0 ? 'X' : 'O';
        });

        // If there is no turn, choose a random
        if (this.state.playerTurn === null) {
          this.state.playerTurn =
            Math.random() > 0.5 ? playersArray[0] : playersArray[1];
        }

        this.state.alert.type = 'warning';
        this.state.alert.message = `Vez do jogador ${this.state.playerTurn.name}`;
      }
    }

    // console.log(Array.from(this.players.values()));
    this.server.emit('state', this.state);
    // console.log(this.state);
  }
}
