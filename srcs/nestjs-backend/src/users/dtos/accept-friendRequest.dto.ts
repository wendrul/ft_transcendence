import {IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class AcceptFriendRequestDto {
	@IsString()
	@ApiProperty()
	status: string;
}
