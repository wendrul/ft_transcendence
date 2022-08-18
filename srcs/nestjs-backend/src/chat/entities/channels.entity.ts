import {User} from "src/users/entities/users.entity";
import {
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import {Message} from "./messages.entity";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.ownedChannels)
	owner: User;

	@ManyToMany(() => User, (user) => user.adminChannels)
	admins: User[];

	@ManyToMany(() => User, (user) => user.channels)
	usesrs: User[];

	@OneToMany(() => Message, (message) => message.reciverChannel)
	messages: Message[];

	@Column({ default: 'public' })
	access: string;

	@Column({ nullable: true })
	password?: string;
}
