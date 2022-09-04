import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import GameRoom from './GameRoom';
// import Ball from qq"./shared/game_objects/Ball"

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => callback(null, true), //remove this, accepts all origins
    methods: ['GET', 'POST'],
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server;
  room : GameRoom;

  constructor() {
  }

  handleConnection(client: any, ...args: any[]) { 
    this.room.connection(client)
  }

  handleDisconnect(client: any) {
    this.room.disconnect(client);
  }
  afterInit(server: any) {
    this.room = new GameRoom(this.server);
    Logger.debug("Created server game object");
    // throw new Error('Method not implemented.');
  }
  @SubscribeMessage('inputUpdate')
  handlePing(client, data)
  {
    this.room.onClientInput(client, data);
  }

  @SubscribeMessage('gameUpdate')
  handleGameUpdate(client, data): void {
    // Logger.debug('Hello');
    // Logger.debug(client);
    // Logger.debug(data);
    // this.game.ball.pos.x = data.ballpos.x;
    // this.game.ball.pos.y = data.ballpos.y;

    // const t = performance.now();
    // this.server.emit('gameUpdate', {
    //   ...data,
    //   timestamp: performance.now(),
    //   ping: 13
    // });

    // let ball = new Ball();
  }
}
