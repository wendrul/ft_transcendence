import {AdminsInChannels} from "src/chat/entities/adminsInChannels.entity";
import {Channel} from "src/chat/entities/channels.entity";
import {Message} from "src/chat/entities/messages.entity";
import {UsersInChannels} from "src/chat/entities/usersInChannels.entity";
import {Match} from "src/game/entities/match.entity";
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import {BlockedUser} from "./blockedUsers.entity";
import {FriendRequest} from "./friendRequest.entity";
import {LocalFile} from "./localFiles.entity";

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

	@Column({ default: true})
	online: boolean;

	@Column({default: false})
	user42: boolean;

	@OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
	sentFriendRequests: FriendRequest[];	

	@OneToMany(() => FriendRequest, (friendRequest) => friendRequest.reciver)
	recivedFriendRequests: FriendRequest[];

	@JoinColumn({ name: 'avatarId' })
	@OneToOne(
		() => LocalFile,
		{
			nullable: true
		}
	)
	avatar?: LocalFile;

	@Column({ default:'/usr/src/avatars/default.jpg' })
	avatarPath: string; 

	@Column({ nullable: true })
	avatarId?: number;

	@Column({ default: true })
	defaultAvatar: boolean;

	@Column({ nullable: true})
	twoFactorAuthenticationSecret?: string;

	@Column({ default: false })
	twoFactorAuthenticationFlag: boolean;

	//blocks

	@OneToMany(() => BlockedUser, (blockedUser) => blockedUser.blocker)
	blockedUsers: BlockedUser[];

	@OneToMany(() => BlockedUser, (blockedUser) => blockedUser.blocked)
	blockedBy: BlockedUser[];

	//Chat
	
	@OneToMany(() => Channel, (channel) => channel.owner)
	ownedChannels: Channel[];	

	@OneToMany(() => AdminsInChannels, (AdminsInChannels) => AdminsInChannels.user)
	adminChannelRelations: AdminsInChannels[];	

	@OneToMany(() => UsersInChannels, (usersInChannels) => usersInChannels.user)
	channelRelations: UsersInChannels[];

	@OneToMany(() => Message, (message) => message.sender)
	sentMessages: Message[];

	@OneToMany(() => Message, (message) => message.reciverUser)
	recivedMessages: Message[];

	//Game
	
	@Column({default: 0})
	wins: number;

	@Column({default: 0})
	loses: number;

	@Column({default: 0})
	score: number;

	@Column({default: false})
	inGame: boolean;

	@Column({default: ""})
	gameRoom: string;

	@OneToMany(() => Match, (match) => match.winer)
	wonMatches: Match[];

	@OneToMany(() => Match, (match) => match.losser)
	lostMatches: Match[];

}
