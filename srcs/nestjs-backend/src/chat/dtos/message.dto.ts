import {Expose, Transform} from "class-transformer";

export class MessageDto {
	
	@Expose()
	id: number;

	@Expose()
	content: string;

	@Expose()
	reciverType: string;

	@Transform(({ obj }) => obj.sender.id)
	@Expose()
	senderId: number;

	@Transform(({ obj }) => obj.reciverUser.id)
	@Expose()
	reciverUserId: number;

	@Transform(({ obj }) => obj.reciverChannel.id)
	reciverChannelId: number;
}
