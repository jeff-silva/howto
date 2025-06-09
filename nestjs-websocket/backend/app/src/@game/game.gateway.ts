/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized', { server });
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`handleConnection: `, { client, args });
  }

  handleDisconnect(client: any) {
    console.log(`handleDisconnect: `, { client });
  }
}
