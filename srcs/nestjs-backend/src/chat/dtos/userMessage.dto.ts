import {Expose, Transform} from "class-transformer";

export class UserMessageDto {
	
	@Expose()
	id: number;

	@Expose()
	content: string;

	@Expose()
	reciverType: string;

	@Transform(({ obj }) => obj.sender.login)
	@Expose()
	senderLogin: string;

	@Transform(({ obj }) => obj.reciverUser.login)
	@Expose()
	reciverUserLogin: string;

	@Transform(({ obj }) => obj.reciverChannel.id)
	reciverChannelId: number;
}
