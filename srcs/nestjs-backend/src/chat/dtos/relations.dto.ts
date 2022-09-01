import {Expose, Transform} from "class-transformer";

export class RelationsDto {
	
	@Expose()
	id: number;

	@Transform(({ obj }) => obj.user.id)
	@Expose()
	userId: number;

	@Transform(({ obj }) => obj.channel.id)
	@Expose()
	channelId: number;
}
