import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from "@nestjs/common";
import {AuthGuardApi} from "src/guards/auth.guard";
import {Serialize} from "src/interceptors/serialize.interceptor";
import {CurrentUser} from "./decorators/current-user.decorator";
import {AcceptFriendRequestDto} from "./dtos/accept-friendRequest.dto";
import {FriendRequestDto} from "./dtos/friendRequest.dto";
import {UserDto} from "./dtos/user.dto";
import {FriendRequestService} from "./friendRequest.service";
import {User} from './entities/users.entity';
import {CreateFriendRequestDto} from "./dtos/create-friendRequest.dto";
import {FriendUserDto} from "./dtos/friendUser.dto";

@Controller('friendRequest')
export class FriendRequestController {
	constructor(
		private friendRequestService: FriendRequestService,
	) {}

	@Post('/create')
	@UseGuards(AuthGuardApi)
	@Serialize(FriendRequestDto)
	create(@CurrentUser() user: User, @Body() body: CreateFriendRequestDto) {
		return this.friendRequestService.create(user, body.login);	
	}

	@Get('/friendData/:login')
	@UseGuards(AuthGuardApi)
	@Serialize(FriendUserDto)
	getFriendData(@CurrentUser() user: User, @Param('login') login: string) {
		return this.friendRequestService.getFriendData(user, login);
	}

	@Get('/friends')
	@UseGuards(AuthGuardApi)
	@Serialize(FriendUserDto)
	getFriends(@CurrentUser() user: User) {
		return this.friendRequestService.getFriends(user);
	}

	@Get('/pendingRequests')
	@Serialize(FriendRequestDto)
	@UseGuards(AuthGuardApi)
	getPendingRequests(@CurrentUser() user: User) {
		return this.friendRequestService.findPending(user);
	}

	@Patch('/:id')
	@UseGuards(AuthGuardApi)
	@Serialize(FriendRequestDto)
	acceptRequest(
		@CurrentUser() user: User,
		@Param('id') id: string,
		@Body() body: AcceptFriendRequestDto) {	

		return this.friendRequestService.changeStatus(user, parseInt(id), body.status);
	}

	@Get('/:id')
	find(@Param('id') id: string) {
		return this.friendRequestService.find(parseInt(id));
	}

	@Delete('/:login')
	@UseGuards(AuthGuardApi)
	@Serialize(FriendRequestDto)
	deleteFriend(@CurrentUser() user: User, @Param('login') login: string) {
		return this.friendRequestService.removeFriend(user, login);
	}
}
