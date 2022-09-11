import {IsString} from "class-validator";

export class CreateFriendRequestDto {

	@IsString()
	login: string;

}
