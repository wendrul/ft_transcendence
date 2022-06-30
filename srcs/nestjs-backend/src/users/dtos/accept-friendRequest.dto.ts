import {IsString} from "class-validator";

export class AcceptFriendRequestDto {
	@IsString()
	status: string;
}
