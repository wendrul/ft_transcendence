import {Expose, Transform} from "class-transformer";
import {User} from '../users.entity';

export class FriendRequestDto {
	@Expose()
	id: number;

	@Expose()
	status: string;

	@Transform(({ obj }) => obj.sender.id)
	@Expose()
	senderId: number;

	@Transform(({ obj }) => obj.reciver.id)
	@Expose()
	reciverId: number;
}
