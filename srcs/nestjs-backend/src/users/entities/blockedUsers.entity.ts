import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./users.entity";

@Entity()
export class BlockedUser {

	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.blockedBy)
	blocked: User;

	@ManyToOne(() => User, (user) => user.blockedUsers)
	blocker: User;

}
