import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import {FriendRequest} from "./friendRequest.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	password: string;

	@Column({ default: null })
	login: string;

	@Column({ default: 'online'})
	status: string;

	@Column({default: false})
	user42: boolean;

	@OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
	sentFriendRequests: FriendRequest[];	

	@OneToMany(() => FriendRequest, (friendRequest) => friendRequest.reciver)
	recivedFriendRequests: FriendRequest[];
}
