import {User} from "src/users/entities/users.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Match {
	@PrimaryGeneratedColumn()
	id: number;		

	@ManyToOne(() => User, (user) => user.wonMatches)
	winer: User;

	@ManyToOne(() => User, (user) => user.lostMatches)
	losser: User;

	@Column()
	winerScore: number;

	@Column()
	losserScore: number;
}
