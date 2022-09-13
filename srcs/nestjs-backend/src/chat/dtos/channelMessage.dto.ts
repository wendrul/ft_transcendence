import {Expose, Transform} from "class-transformer";

export class ChannelMessageDto {
	
	@Expose()
	id: number;

	@Expose()
	content: string;

	@Expose()
	reciverType: string;

	@Transform(({ obj }) => obj.sender.login)
	@Expose()
	senderLogin: string;

	@Transform(({ obj }) => obj.reciverChannel.name)
	@Expose()
	reciverChannelName: number;
}
