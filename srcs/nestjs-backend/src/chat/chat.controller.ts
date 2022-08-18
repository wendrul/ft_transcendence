import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UseGuards,
} from "@nestjs/common";
import {AuthGuardApi} from "src/guards/auth.guard";
import {Serialize} from "src/interceptors/serialize.interceptor";
import {CurrentUser} from "src/users/decorators/current-user.decorator";
import {UserDto} from "src/users/dtos/user.dto";
import {User} from "src/users/entities/users.entity";
import {ChatService} from "./chat.service";
import {CreateMessageDto} from "./dtos/create-message.dto";
import {MessageDto} from "./dtos/message.dto";

@Controller('chat')
export class ChatController {
	constructor(
		private chatService: ChatService,
	) {}

	@Serialize(MessageDto)
	@Post('/createMessageForUser/:id')
	@UseGuards(AuthGuardApi)
	async createMessage(@CurrentUser() user: User, @Param('id') id: string, @Body() body: CreateMessageDto) {

		const message = await this.chatService.createMessageForUser(body.content, user, parseInt(id));

		return message;
	}

	@Serialize(UserDto)
	@Get('/openConversations')
	@UseGuards(AuthGuardApi)
	async getOpenConversations(@CurrentUser() user: User) {
		const users = await this.chatService.getOpenConversations(user);	

		return users;
	}

	@Serialize(MessageDto)
	@Get('/getMessagesWith/:id')
	@UseGuards(AuthGuardApi)
	async getConversation(@CurrentUser() user: User, @Param('id') id: string) {
		const messages = await this.chatService.getMessagesWith(user, parseInt(id));

		return messages;
	}

}
