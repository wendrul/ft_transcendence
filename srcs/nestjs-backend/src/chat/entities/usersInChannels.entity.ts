import {User} from "src/users/entities/users.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Channel} from "./channels.entity";

@Entity()
export class UsersInChannels {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.channelRelations)	
	user: User;

	@ManyToOne(() => Channel, (channel) => channel.usersRelations)
	channel: Channel;

	@Column("timestamptz", { nullable: true, default: '1996-10-28'})
	mutedUntil: Date;

	@Column({default: false})
	ban: boolean;
}
