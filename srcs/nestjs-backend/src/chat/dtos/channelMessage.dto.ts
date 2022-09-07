import {Expose, Transform} from "class-transformer";

export class ChannelMessageDto {
	
	@Expose()
	id: number;

	@Expose()
	content: string;

	@Expose()
	reciverType: string;

	@Transform(({ obj }) => obj.sender.id)
	@Expose()
	senderId: number;

	@Transform(({ obj }) => obj.reciverChannel.id)
	@Expose()
	reciverChannelId: number;
}