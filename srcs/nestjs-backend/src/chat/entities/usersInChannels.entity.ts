import {User} from "src/users/entities/users.entity";
import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Channel} from "./channels.entity";

@Entity()
export class UsersInChannels {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.channelRelations)	
	user: User;

	@ManyToOne(() => Channel, (channel) => channel.usersRelations)
	channel: Channel;

}
