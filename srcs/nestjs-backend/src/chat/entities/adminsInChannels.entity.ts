import {User} from "src/users/entities/users.entity";
import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Channel} from "./channels.entity";

@Entity()
export class AdminsInChannels {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.adminChannelRelations)	
	user: User;

	@ManyToOne(() => Channel, (channel) => channel.adminRelations)
	channel: Channel;

}
