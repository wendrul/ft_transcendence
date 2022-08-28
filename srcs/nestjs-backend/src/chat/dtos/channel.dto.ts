import {Expose, Transform} from "class-transformer";
import {User} from "src/users/entities/users.entity";
import {AdminsInChannels} from "../entities/adminsInChannels.entity";
import {UsersInChannels} from "../entities/usersInChannels.entity";


export class ChannelDto {

	@Expose()
	id: number;

	@Expose()
	name: string;

	@Transform(({ obj }) => obj.owner.id)
	@Expose()	
	ownerId: number;

	@Transform(({ obj }) => {
		if (!obj.usersRelations) {
			return ;
		}

		let usersIds: number[] = [];
		for (let i = 0; i < obj.usersRelations.length; i++) {
			usersIds.push(obj.usersRelations[i].user.id);
		}
		return usersIds;
	})
	@Expose()
	userIds: number[];

	@Transform(({ obj }) => {
		if (!obj.adminRelations) {
			return ;
		}

		let adminIds: number[] = [];
		for (let i = 0; i < obj.adminRelations.length; i++) {
			adminIds.push(obj.adminRelations[i].user.id)
		}

		return adminIds;
	})
	@Expose()
	adminIds: number[];

	@Expose()
	access: string;
}