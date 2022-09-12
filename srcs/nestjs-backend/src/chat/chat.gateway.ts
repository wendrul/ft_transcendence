import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import {CreateMessageDto} from "./dtos/create-message.dto";
import {Socket, Server} from "socket.io";
import {Logger, UseGuards} from "@nestjs/common";
import {AuthGuardApi} from "src/guards/auth.guard";

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	// namespace: '/web_chat',
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	// constructor(private chatSocketService: ChatSocketService) {}	

	@WebSocketServer() server: Server;

	private logger: Logger = new Logger('ChatGateway');

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);

	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	// @SubscribeMessage('createMessageForUser')
	// create(client: Socket, message: CreateMessageDto) {
	// 	return this.chatSocketService.createMessageForUser();
	// }
	
	// @UseGuards(AuthGuardApi)
	@SubscribeMessage('sendMessageToUser')
	sendMessageToUser(client: Socket, message: any) {
		// console.log('funciona');
		this.server.emit('message', message);
	}

	@SubscribeMessage('sendMessage')
	createMessageForChannel(client: Socket, message: {sender: string, room: string, message: string}) {
		console.log('funciona');
		console.log(message.message);
		console.log(message.room);
		this.server.to(message.room).emit('messageFromChannel', message)	
	}

	@SubscribeMessage('joinRoom')
	joinRoom(client: Socket, room: string) {
		console.log(room);
		client.join(room);
		client.emit('joinedRoom', room);
	}

	@SubscribeMessage('leaveRoom')
	leaveRoom(client: Socket, room: string) {
		client.leave(room);
		client.emit('leftRoom', room);
	}

}
