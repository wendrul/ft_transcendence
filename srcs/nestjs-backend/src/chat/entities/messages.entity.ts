import {User} from "src/users/entities/users.entity";
import {
	Column, 
	Entity, 
	ManyToOne, 
	PrimaryGeneratedColumn
} from "typeorm";
import {Channel} from "./channels.entity";

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	content: string;

	@ManyToOne(() => User, (user) => user.sentMessages)
	sender: User;

	@Column({ default: 'user' })
	reciverType: string;

	@ManyToOne(() => User, (user) => user.recivedMessages)
	reciverUser: User;

	@ManyToOne(() => Channel, (channel) => channel.messages)
	reciverChannel: Channel;
}
