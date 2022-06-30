import {Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import {User} from "./users.entity";

@Entity()
export class FriendRequest {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 'pending'})
	status: string;

	@ManyToOne(() => User, (user) => user.sentFriendRequests)	
	sender: User;

	@ManyToOne(() => User, (user) => user.recivedFriendRequests)	
	reciver: User;
}
