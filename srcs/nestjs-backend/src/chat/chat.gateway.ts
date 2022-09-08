import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import {CreateMessageDto} from "./dtos/create-message.dto";
import {Socket, Server} from "socket.io";
import {Logger} from "@nestjs/common";

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class MessagesGateway {
	// constructor(private chatSocketService: ChatSocketService) {}	

	@WebSocketServer() server: Server;

	private logger: Logger = new Logger('ChatGateway');

	afterInit(server: any) {
		this.logger.log('Initialized!');
	}

	// @SubscribeMessage('createMessageForUser')
	// create(client: Socket, message: CreateMessageDto) {
	// 	return this.chatSocketService.createMessageForUser();
	// }

	@SubscribeMessage('createMessageForChannel')
	createMessageForChannel(client: Socket, message: {sender: string, room: string, message: string}) {
		this.server.to(message.room).emit('messageFromChannel', message)	
	}

	@SubscribeMessage('joinRoom')
	joinRoom(client: Socket, room: string) {
		client.join(room);
		client.emit('joinedRoom', room);
	}

	@SubscribeMessage('leaveRoom')
	leaveRoom(client: Socket, room: string) {
		client.leave(room);
		client.emit('leftRoom', room);
	}

}
