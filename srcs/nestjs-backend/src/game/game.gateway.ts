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
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
// import Ball from qq"./shared/game_objects/Ball"

type GameClient = {
  name: string;
  roomID: string;
  premade: boolean;
  socket: Socket;
  spectator: boolean;
};

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => callback(null, true), //remove this, accepts all origins
    methods: ['GET', 'POST'],
  },
  namespace: '/game',
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  private server: any;

  private matchQueue: GameClient[];

  private gameClients: Map<string, GameClient>;
  private gameRooms: Map<string, GameRoom>;

  private logger = new Logger('GameGateway');

  constructor(private gameService: GameService) {
    this.matchQueue = [];
    this.gameRooms = new Map<string, GameRoom>();
    this.gameClients = new Map<string, GameClient>();
  }

  handleConnection(client: Socket, ...args: any[]) {
    const query = client.handshake.query;
    if (
      query.name === undefined ||
      query.roomID === undefined ||
      query.premade === undefined ||
      query.spectator === undefined
    ) {
      this.logger.error("didn't receive sufficeint fields on query");
      client.disconnect();
    }
    const newClient: GameClient = {
      name: query.name as string,
      roomID: query.roomID as string,
      premade: query.premade === 'true',
      socket: client,
      spectator: query.spectator === 'true',
    };

    if (!this.validateClient(newClient)) {
      client.disconnect();
      return;
    }

    this.gameClients.set(client.id, newClient);
    if (newClient.name.length == 0) {
      this.logger.error(
        `Nameless client tried connecting. Refusing connection`,
      );
      client.disconnect();
      return;
    }
    this.logger.log(
      `New client "${newClient.name}" with ID ${newClient.socket.id} connected`,
    );

    /* For test and debug */
    if (query.test === 'true') {
      if (!this.gameRooms.has('test')) {
        this.logger.debug('Hola');
        this.gameRooms.set(
          'test',
          new GameRoom(this.server.to('test'), 'test', this.gameService, () =>
            this.shutoff('test'),
          ),
        );
      }
      newClient.roomID = 'test';
      client.join('test');
      this.gameRooms.get('test').TESTconnection(client, 'pogTester');
      return;
    }
    /* End test and debug*/

    if (newClient.spectator) {
      // Spectate match
      this.connectSpectator(newClient);
    } else if (newClient.premade) {
      // Premade Match
      this.connectToPremadeMatch(newClient);
    } else {
      // Normal matchmaking
      this.connectToMatchmaking(newClient);
    }
  }

  private validateClient(newClient: GameClient): boolean {
    //Add authentication here if needed
    for (const client of this.gameClients.values()) {
      if (client.name === newClient.name) {
        this.logger.warn(
          `Closing connection to active socket from user '${newClient.name}' as the client opened a new connection`,
        );
        client.socket.disconnect();
      }
    }

    return true;
  }

  private connectSpectator(newClient: GameClient) {
    const room = this.gameRooms[newClient.roomID];
    if (!room) {
      this.logger.error('Failed to find room that spectator was looking for');
      newClient.socket.disconnect();
    } else {
      newClient.socket.join(newClient.roomID);
      room.connection(newClient.socket, newClient.name, true);
      this.logger.log(
        `${newClient.name} [${newClient.socket.id}] started spectating room with ID: ${newClient.roomID}`,
      );
    }
  }

  private connectToPremadeMatch(newClient: GameClient) {
    if (!this.gameRooms.has(newClient.roomID)) {
      this.gameRooms.set(
        newClient.roomID,
        new GameRoom(
          this.server.to(newClient.roomID),
          newClient.roomID,
          this.gameService,
          () => this.shutoff(newClient.roomID),
        ),
      );

      newClient.socket.join(newClient.roomID);
      this.gameRooms
        .get(newClient.roomID)
        .connection(newClient.socket, newClient.name);

      this.logger.log(
        `${newClient.name} [${newClient.socket.id}] created new room with ID: ${newClient.roomID}`,
      );
    } else {
      this.gameRooms
        .get(newClient.roomID)
        .connection(newClient.socket, newClient.name);

      this.logger.log(
        `${newClient.name} [${newClient.socket.id}] connected to room with ID: ${newClient.roomID}`,
      );
    }
  }

  private connectToMatchmaking(newClient: GameClient) {
    this.matchQueue.push(newClient);
    if (this.matchQueue.length >= 2) {
      const player1 = this.matchQueue.shift();
      const player2 = this.matchQueue.shift();
      const roomID = `${player1.socket.id}|${player2.socket.id}`;
      player1.roomID = roomID;
      player2.roomID = roomID;
      this.gameRooms.set(
        roomID,
        new GameRoom(this.server.to(roomID), roomID, this.gameService, () =>
          this.shutoff(roomID),
        ),
      );
      player1.socket.join(player1.roomID);
      player2.socket.join(player2.roomID);
      this.gameRooms.get(roomID).connection(player1.socket, player1.name);
      this.gameRooms.get(roomID).connection(player2.socket, player2.name);
      this.logger.log(
        `${player1.name} [${player1.socket.id}] created new room with ID: ${player1.roomID}`,
      );
      this.logger.log(
        `${player2.name} [${player2.socket.id}] connected to room with ID: ${player2.roomID}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    // If he was in a matchmaking queue
    for (let i = 0; i < this.matchQueue.length; i++) {
      const gameClient = this.matchQueue[i];
      if (gameClient.socket.id == client.id) {
        this.logger.log(
          `${gameClient.name} [${client.id}] abandoned matchmaking queue (disconnected)`,
        );
        this.matchQueue.splice(i, 1);
        this.gameClients.delete(client.id);
        return;
      }
    }

    const gameClient = this.gameClients.get(client.id);
    if (gameClient && this.gameRooms.has(gameClient.roomID)) {
      this.logger.log(
        `${gameClient.name} [${client.id}] disconnected (was in room ${gameClient.roomID})`,
      );
      this.gameRooms.get(gameClient.roomID).disconnect(client);
    } else {
      this.logger.error(
        `Cannot find client or room, gameClient = ${gameClient}`,
      );
      client.disconnect();
    }
    this.gameClients.delete(client.id);
  }

  afterInit(server: Server) {
    this.logger.log(
      'Game server up and running, waiting for connections to create a game room or add players to queue',
    );
  }

  @SubscribeMessage('inputUpdate')
  handleInputUpdate(client: Socket, data: any) {
    const gameClient = this.gameClients.get(client.id);
    if (gameClient && this.gameRooms.has(gameClient.roomID)) {
      this.gameRooms.get(gameClient.roomID).onClientInput(client, data);
    } else {
      this.logger.error(
        `Cannot find client or room, gameClient = ${gameClient}`,
      );
      client.disconnect();
    }
  }

  @SubscribeMessage('pingBack')
  handlePingBack(client: Socket, data: any) {
    const gameClient = this.gameClients.get(client.id);
    if (gameClient && this.gameRooms.has(gameClient.roomID)) {
      this.gameRooms.get(gameClient.roomID).onPingback(client, data);
    } else {
      this.logger.error(
        `Cannot find client or room, gameClient = ${gameClient}`,
      );
      client.disconnect();
    }
  }

  shutoff(roomID: string) {
    const room = this.gameRooms.get(roomID);
    if (room.id != roomID) throw new Error("room id didn't match on shutoff");
    const connectedIDs = room.getAllConnectedIDs();
    for (const id of connectedIDs) {
      if (!this.gameClients.has(id)) continue;

      const client = this.gameClients.get(id);
      client.socket.disconnect();
      this.gameClients.delete(id);
    }
    this.server.socketsLeave(roomID);
    this.server.to(roomID).disconnectSockets();
    this.gameRooms.delete(roomID);
  }
}
