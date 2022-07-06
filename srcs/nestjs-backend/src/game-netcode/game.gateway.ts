import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

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
  }
}
