import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
// import Ball from qq"./shared/game_objects/Ball"
import Game from './shared/util/Game';

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
  game: Game;

  constructor() {
    this.game = new Game();
    Logger.debug("Hey");
  }

  handleConnection(client: any, ...args: any[]) {
    // throw new Error('Method not implemented.');
  }
  handleDisconnect(client: any) {
    Logger.debug("Disconnected")
    Logger.debug(Object.keys(client.client))
    // Logger.debug(client.client.id)
    // Logger.debug(client.id)
    // throw new Error('Method not implemented.');
  }
  afterInit(server: any) {
    Logger.debug("oi");
    // throw new Error('Method not implemented.');
  }
  @SubscribeMessage('gameUpdate')
  handleGameUpdate(client, data): void {
    // Logger.debug('Hello');
    // Logger.debug(client);
    // Logger.debug(data);
    // this.game.ball.pos.x = data.ballpos.x;
    // this.game.ball.pos.y = data.ballpos.y;

    const t = performance.now();
    this.server.emit('gameUpdate', {
      ...data,
      timestamp: performance.now(),
      ping: 13
    });

    // let ball = new Ball();
  }
}
