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
	password: string;

	@Column()
	login: string;

	@Column({ default: 'online'})
	status: string;

	@OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
	sentFriendRequests: FriendRequest[];	

	@OneToMany(() => FriendRequest, (friendRequest) => friendRequest.reciver)
	recivedFriendRequests: FriendRequest[];
}
