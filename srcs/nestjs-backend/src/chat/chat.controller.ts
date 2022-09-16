import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import {AuthGuardApi} from "src/guards/auth.guard";
import {Serialize} from "src/interceptors/serialize.interceptor";
import {CurrentUser} from "src/users/decorators/current-user.decorator";
import {UserDto} from "src/users/dtos/user.dto";
import {User} from "src/users/entities/users.entity";
import {ChatService} from "./chat.service";
import {ChannelDto} from "./dtos/channel.dto";
import {ChannelMessageDto} from "./dtos/channelMessage.dto";
import {CreateChannelDto} from "./dtos/create-channel.dto";
import {CreateMessageDto} from "./dtos/create-message.dto";
import {JoinChannelDto} from "./dtos/join-channel.dto";
import {MuteUserDto} from "./dtos/mute-user.dto";
import {RelationsDto} from "./dtos/relations.dto";
import {SetAdminDto} from "./dtos/set-admin.dto";
import {UnmuteUserDto} from "./dtos/unmute-user.dto";
import {UserMessageDto} from "./dtos/userMessage.dto";

@Controller('chat')
export class ChatController {
	constructor(
		private chatService: ChatService,
	) {}

	@Patch('/changePasswordForChannel/:id')
	@UseGuards(AuthGuardApi)
	async changePasswordForChannel(@CurrentUser() user: User, @Param('id') id: string, @Body() body: { password: string } ) {
		await this.chatService.changePasswordForChannel(user, parseInt(id), body.password);
	}

	@Get('/removePasswordForChannel/:id')
	@UseGuards(AuthGuardApi)		
	async removePasswordForChannel(@CurrentUser() user: User, @Param('id') id: string) {
		await this.chatService.removePasswordForChannel(user, parseInt(id));
	}

	@Post('/kick')
	@UseGuards(AuthGuardApi)
	async kickUser(@CurrentUser() user: User, @Body() body: UnmuteUserDto) {
		await this.chatService.kickUser(user, body.user, body.channel);
	}

	@Post('/banUser')
	@HttpCode(200)
	@UseGuards(AuthGuardApi)
	async banUser(@CurrentUser() user: User, @Body() body: UnmuteUserDto) {
		await this.chatService.banUser(user, body.user, body.channel);
	}

	@Post('/unbanUser')
	@HttpCode(200)
	@UseGuards(AuthGuardApi)
	async unbanUser(@CurrentUser() user: User, @Body() body: UnmuteUserDto) {
		await this.chatService.unbanUser(user, body.user, body.channel);
	}

	@Post('/unmuteUser')
	@HttpCode(200)
	@UseGuards(AuthGuardApi)
	async unmuteUser(@CurrentUser() user: User, @Body() body: UnmuteUserDto) {
		await this.chatService.unmuteUser(user, body.user, body.channel);	
	}

	@Post('/muteUser')
	@HttpCode(200)
	@UseGuards(AuthGuardApi)
	async muteUser(@CurrentUser() user: User, @Body() body: MuteUserDto) {
		await this.chatService.muteUser(user, body.user, body.channel, body.time);
	}

	@Serialize(UserMessageDto)
	@Post('/createMessageForUser/:id')
	@UseGuards(AuthGuardApi)
	async createMessage(@CurrentUser() user: User, @Param('id') id: string, @Body() body: CreateMessageDto) {
		const message = await this.chatService.createMessageForUser(body.content, user, parseInt(id));
		return message;
	}

	@Serialize(ChannelMessageDto)
	@Post('/createMessageForChannel/:name')
	@UseGuards(AuthGuardApi)
	async createMessageForChannel(@CurrentUser() user: User, @Param('name') name: string, @Body() body: CreateMessageDto) {
		const message = await this.chatService.createMessageForChannel(body.content, user, name);
		return message;
	}

	@Serialize(ChannelDto)
	@Post('/createChannel')
	@UseGuards(AuthGuardApi)
	async createChannel(@CurrentUser() user: User, @Body() body: CreateChannelDto) {
		const channel = await this.chatService.createChannel(body.userLogins, body.access, body.password, body.name, user)
		return channel;	
	}

	@Serialize(RelationsDto)
	@Post('/joinChannel')
	@UseGuards(AuthGuardApi)
	async joinChannel(@CurrentUser() user: User, @Body() body: JoinChannelDto) {

		let password: string;
		if (!body.password) {
			password = null;
		}
		else {
			password = body.password;
		}

		const channel = await this.chatService.joinChannel(user, body.name, password);
		return channel;
	}

	@Serialize(RelationsDto)
	@Post('/setAdmin')
	@UseGuards(AuthGuardApi)
	async setAdmin(@CurrentUser() user: User, @Body() body: SetAdminDto) {
		const admin = await this.chatService.setAdmin(user, body.name, body.login);
		return admin;
	}

	@Get('/isUserBanned')
	@UseGuards(AuthGuardApi)
	async isUserBanned(@Query() query: UnmuteUserDto) {
		return this.chatService.isUserBanned(query.user, query.channel);
	}

	@Serialize(ChannelDto)
	@Get('/getChannelByType/:type')
	@UseGuards(AuthGuardApi)
	async getChannelByType(@Param('type') type: string) {
		const channels = await this.chatService.getChannelByType(type);
		return channels;
	}

	@Serialize(ChannelDto)
	@Get('/getMyChannelsByType/:type')
	@UseGuards(AuthGuardApi)
	async getMyChannelByType(@CurrentUser() user: User, @Param('type') type: string) {
		const channels = await this.chatService.getMyChannelsByType(user, type);
		return channels;
	}

	@Serialize(ChannelDto)
	@Get('/channelData/:name')
	@UseGuards(AuthGuardApi)
	async getChannelData(@CurrentUser() user: User, @Param('name') name: string) {
		const channel = await this.chatService.getChannel(user, name);
		return channel;
	}

	@Serialize(ChannelMessageDto)
	@Get('/getChannelMessages/:name')
	@UseGuards(AuthGuardApi)
	async getChannelMessages(@CurrentUser() user: User, @Param('name') name: string) {
		const messages = await this.chatService.getChannelMessages(user, name);

		return messages;
	}

	@Serialize(UserDto)
	@Get('/openConversations')
	@UseGuards(AuthGuardApi)
	async getOpenConversations(@CurrentUser() user: User) {
		const users = await this.chatService.getOpenConversations(user);	

		return users;
	}

	@Serialize(UserMessageDto)
	@Get('/getMessagesWith/:id')
	@UseGuards(AuthGuardApi)
	async getConversation(@CurrentUser() user: User, @Param('id') id: string) {
		const messages = await this.chatService.getMessagesWith(user, parseInt(id));

		return messages;
	}

	@UseGuards(AuthGuardApi)
	@Get('/leaveChannel/:name')
	async leaveChannel(@CurrentUser() user: User, @Param('name') name: string) {
		return this.chatService.leaveChannel(user, name);	
	}

}
