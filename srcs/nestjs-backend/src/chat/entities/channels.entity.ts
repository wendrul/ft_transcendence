import {User} from "src/users/entities/users.entity";
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import {AdminsInChannels} from "./adminsInChannels.entity";
import {Message} from "./messages.entity";
import {UsersInChannels} from "./usersInChannels.entity";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => User, (user) => user.ownedChannels)
	owner: User;

	@OneToMany(() => AdminsInChannels, (adminsInChannels) => adminsInChannels.channel)
	adminRelations: AdminsInChannels[];

	@OneToMany(() => UsersInChannels, (usersInChannels) => usersInChannels.channel)
	usersRelations: UsersInChannels[];

	@OneToMany(() => Message, (message) => message.reciverChannel)
	messages: Message[];

	@Column({ default: 'public' })
	access: string;

	@Column({ nullable: true })
	password?: string;
}
