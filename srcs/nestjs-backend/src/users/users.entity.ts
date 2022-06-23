import {
	Column,
	Entity,
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
}
