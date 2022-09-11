import {Expose, Transform} from "class-transformer";
import {User} from '../entities/users.entity';
import { ApiProperty } from "@nestjs/swagger"

export class FriendRequestDto {
	@Expose()
	@ApiProperty()
	id: number;

	@Expose()
	@ApiProperty()
	status: string;

	@Transform(({ obj }) => obj.sender.id)
	@Expose()
	@ApiProperty()
	senderId: number;

	@Transform(({ obj }) => obj.reciver.id)
	@Expose()
	@ApiProperty()
	reciverId: number;
}
