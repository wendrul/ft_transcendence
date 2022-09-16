import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import {Socket, Server} from "socket.io";
import {Logger, UseGuards} from "@nestjs/common";
import {UsersService} from "src/users/users.service";

interface userIds {
	socketId: string;
	userLogin: string;
}

@WebSocketGateway({
	cors: {
		origin: '*',
	},
	// namespace: '/web_chat',
})
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	constructor(private userService: UsersService) {}	

	@WebSocketServer() server: Server;

	private logger: Logger = new Logger('ChatGateway');
	private	usersMap = new Map<string, string>();

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		// client.emit('youAreOnline', true, client.id);

	}

	async handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		let login: string;
		login = this.usersMap.get(client.id);
		this.usersMap.delete(client.id);
		const user = await this.userService.findOneLogin(login);
		if (user)
			this.userService.update(user, {online: false});
	}

	// @SubscribeMessage('createMessageForUser')
	// create(client: Socket, message: CreateMessageDto) {
	// 	return this.chatSocketService.createMessageForUser();
	// }
	
	@SubscribeMessage('online')
	sendMessageToUser(client: Socket) {
		client.emit('youAreOnline', true);
	}

	@SubscribeMessage('setId')
	setId(client: Socket, login: string) {
		this.usersMap.set(client.id, login);
	}

	@SubscribeMessage('sendMessage')
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
