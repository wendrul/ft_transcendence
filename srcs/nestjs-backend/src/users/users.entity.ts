import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	login: string;

	@Column({ default: 'online'})
	status: string;

	@ManyToMany(() => User, (user) => user.friends)
	@JoinTable()
	friendOf: User[];

	@ManyToMany(() => User, (user) => user.friendOf)
	friends: User[];
}
