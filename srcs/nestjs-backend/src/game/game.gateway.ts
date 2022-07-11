import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

// import Ball from "./shared/game_objects/Ball"

@WebSocketGateway({
  cors: {
    origin: 'http://localhost',
    methods: ['GET', 'POST'],
  },
})
export class GameGateway {
  @WebSocketServer()
  server;
  @SubscribeMessage('gameUpdate')
  handleGameUpdate(client, data): void {
    this.server.emit('gameUpdate', data);
    // let ball = new Ball();
  }
  
}
