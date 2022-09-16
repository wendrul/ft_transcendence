import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {randomBytes, scrypt as _scrypt} from "crypto";
import {BlockedUser} from "src/users/entities/blockedUsers.entity";
import {User} from "src/users/entities/users.entity";
import {UsersService} from "src/users/users.service";
import {Repository} from "typeorm";
import {promisify} from "util";
import {AdminsInChannels} from "./entities/adminsInChannels.entity";
import {Channel} from "./entities/channels.entity";
import {Message} from "./entities/messages.entity";
import {UsersInChannels} from "./entities/usersInChannels.entity";

const scrypt = promisify(_scrypt);

function isUserInChannel(user: User, channel: Channel): boolean {
	const userRelations = channel.usersRelations;
	let flag: boolean = false;
	for (let i = 0; i < userRelations.length; i++) {
		if (user.id === userRelations[i].user.id) {
			flag = true;
		} 
	}
	return flag;
}

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Message) private messageRepo: Repository<Message>,
		@InjectRepository(Channel) private channelRepo: Repository<Channel>,
		@InjectRepository(UsersInChannels) private usersInChannelsRepo: Repository<UsersInChannels>,
		@InjectRepository(AdminsInChannels) private adminsInChannelsRepo: Repository<AdminsInChannels>,
		@InjectRepository(BlockedUser) private blockRepo: Repository<BlockedUser>,
		private userService: UsersService,
	) {}

	async isUserBanned(login: string, name: string) {
		const channel = await this.channelRepo.findOne({
			relations: ['usersRelations', 'usersRelations.user'],
			where: {
				name: name,
			}
		});
		if (!channel) {
			throw new NotFoundException('Channel not found');
		}

		const user = await this.userService.findOneLogin(login);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const relation = await this.usersInChannelsRepo.findOne({
			relations: ['user', 'channel'],
			where: {
				user: user,
				channel: channel
			}
		});
		if (!relation) {
			throw new NotFoundException('User not in channel');
		}

		return relation.ban;
	}

	async leaveChannel(user: User, name: string) {
		const channel = await this.channelRepo.findOne({
			relations: ['owner', 'adminRelations', 'adminRelations.user', 'usersRelations', 'usersRelations.user'],
			where: {
				name: name,					
			}
		});	
		if (!channel) {
			throw new NotFoundException('Channel not found');
		}		
		if (channel.owner.id === user.id) {
			throw new BadRequestException('The owner cant leave the channel');
		}

		const usersRelations = channel.usersRelations;
		let	n: number;
		let flag: boolean = false;
		for (let i = 0; i < usersRelations.length; i++) {
			if (user.id === usersRelations[i].user.id) {
				flag = true;
				n = i;
			} 
		}
		if (!flag) {
			throw new HttpException('User not in channel', HttpStatus.FORBIDDEN);
		}
		if (usersRelations[n].ban) {
			throw new HttpException("You can't leave the channel if you are banned", HttpStatus.FORBIDDEN);
		}

		const adminRelations = channel.adminRelations;
		let	m: number;
		let adminFlag: boolean = false;
		for (let i = 0; i < adminRelations.length; i++) {
			if (user.id === adminRelations[i].user.id) {
				adminFlag = true;
				m = i;
			} 
		}
		if (adminFlag) {
			await this.adminsInChannelsRepo.remove(adminRelations[m]);
		}

		return this.usersInChannelsRepo.remove(usersRelations[n]);	
	}

	async changePasswordForChannel(user: User, id: number, password: string) {
		const channel = await this.channelRepo.findOne({
			relations: ['owner'],
			where: {
				id: id,
			}
		});	

		if (!channel) {
			throw new NotFoundException('channel not found');
		}

		if (user.id !== channel.owner.id) {
			throw new HttpException('you are not the channel owner', HttpStatus.FORBIDDEN);
		}

		const salt = randomBytes(8).toString('hex');	
		const hash = (await scrypt(password, salt, 32)) as Buffer;
		const result = salt + '.' + hash.toString('hex');
		password = result;

		return this.channelRepo.update(id, {
			password: password,
			access: 'protected'
		});
		
	}

	async removePasswordForChannel(user: User, id: number) {
		const channel = await this.channelRepo.findOne({
			relations: ['owner'],
			where: {
				id: id,
			}
		});	

		if (!channel) {
			throw new NotFoundException('channel not found');
		}

		if (user.id !== channel.owner.id) {
			throw new HttpException('you are not the channel owner', HttpStatus.FORBIDDEN);
		}

		return this.channelRepo.update(id, {
			password: null, 
			access: 'public'
		});

	}

	async getMyChannelsByType(user: User, type: string) {

		//search the channels
		const channels = await this.channelRepo.find({
			relations: ['usersRelations', 'usersRelations.user', 'adminRelations', 'adminRelations.user', 'owner'],
			where: {
				access: type,
			}	
		});

		let myChannels: Channel[] = [];
		for (let i = 0; i < channels.length; i++) {
			if (isUserInChannel(user, channels[i])) {
				myChannels.push(channels[i]);
			}
		}

		return myChannels;
		
	}

	async getChannelByType(type: string) {

		//search the channels
		const channels = await this.channelRepo.find({
			relations: ['usersRelations', 'usersRelations.user', 'adminRelations', 'adminRelations.user', 'owner'],
			where: {
				access: type
			}
		});

		return channels;

	}

	async getChannel(user: User, name: string) {

		//search the channel by name
		const channels = await this.channelRepo.find({
			relations: ['usersRelations', 'usersRelations.user', 'adminRelations', 'adminRelations.user', 'owner'],
			where: {
				name: name,
			}
		});

		if (channels.length === 0) {
			throw new NotFoundException('channel not found');	
		}
		const channel: Channel = channels[0];

		//check if user is in channel
		// const userRelations = channel.usersRelations;
		// let flag: boolean = false;
		// for (let i = 0; i < userRelations.length; i++) {
		// 	if (user.id === userRelations[i].user.id) {
		// 		flag = true;
		// 	} 
		// }
		// if (!flag) {
		// 	throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		// }

		return channel;

	}

	async createChannel(userLogins: string[], access: string, password: string, name: string, owner: User) {
		//check if name is used
		const channels = await this.channelRepo.find({ where: {name: name} });	
		if (channels.length) {
			throw new BadRequestException('name in use');
		}
		
		//find users
		let users: User[] = [];

		for (let i = 0; i < userLogins.length; i++) {
			const user = await this.userService.findOneLogin(userLogins[i]);
			if (user && (user.id !== owner.id)) {
				users.push(user);
			}
		}
		users.push(owner);

		if (access === 'protected' && password === "") {
			throw new BadRequestException('Please enter a password');	
		}

		//hash password
		if (access === 'protected') {
			const salt = randomBytes(8).toString('hex');	
			const hash = (await scrypt(password, salt, 32)) as Buffer;
			const result = salt + '.' + hash.toString('hex');
			password = result;
		}

		//create channel and save parameters
		let channel = this.channelRepo.create({ access, password });
		channel.owner = owner;
		channel.name = name;

		channel = await this.channelRepo.save(channel);

		//create support relations
		for (let i = 0; i < users.length; i++) {
			const usersInChannel = this.usersInChannelsRepo.create({ user: users[i], channel });
			await this.usersInChannelsRepo.save(usersInChannel);
		}
		const adminsInChannel = this.adminsInChannelsRepo.create({ user: owner, channel });
		await this.adminsInChannelsRepo.save(adminsInChannel);

		return channel;
	}

	async joinChannel(user: User, name: string, password: string) {

		//search the channel by name
		const channels = await this.channelRepo.find({
			relations: ['usersRelations', 'usersRelations.user'],
			where: {
				name: name,
			}
		});

		if (channels.length === 0) {
			throw new NotFoundException('channel not found');	
		}
		const channel: Channel = channels[0];

		//check if user is in channel
		const userRelations = channel.usersRelations;
		let flag: boolean = false;
		for (let i = 0; i < userRelations.length; i++) {
			if (user.id === userRelations[i].user.id) {
				flag = true;
			} 
		}
		if (flag) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		//manage access
		if (channel.access === 'private') {
			throw new HttpException('Forbidden: private channel', HttpStatus.FORBIDDEN);
		}
		else if (channel.access === 'protected') {
			const [salt, storedHash] = channel.password.split('.');	
			const hash = (await scrypt(password, salt, 32)) as Buffer;

			if (storedHash !== hash.toString('hex')) {
				throw new BadRequestException('bad password');
			}
		}

		//add user relation
		const userInChannel = this.usersInChannelsRepo.create({ user, channel });
		return this.usersInChannelsRepo.save(userInChannel);

	}
	
	async setAdmin(user: User, name: string, login: string) {

		//search the channel by name
		const channels = await this.channelRepo.find({
			relations: ['adminRelations', 'adminRelations.user'],
			where: {
				name: name,
			}
		});

		if (channels.length === 0) {
			throw new NotFoundException('channel not found');	
		}
		const channel: Channel = channels[0];

		//check if user is admin
		const adminRelations = channel.adminRelations;
		let flag: boolean = false;
		for (let i = 0; i < adminRelations.length; i++) {
			if (user.id === adminRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		//search new admin
		const newAdmin = await this.userService.findOneLogin(login);
		if (!newAdmin) {
			throw new NotFoundException('user not found');	
		}

		flag = true;
		for (let i = 0; i < adminRelations.length; i++) {
			if (login === adminRelations[i].user.login) {
				flag = false;	
			}
		}
		if (!flag) {
			throw new HttpException('Already an admin', HttpStatus.FORBIDDEN);
		}

		//add new admin
			const adminInChannel = this.adminsInChannelsRepo.create({ user: newAdmin, channel });
			return this.adminsInChannelsRepo.save(adminInChannel);

		}

		async createMessageForChannel(content: string, sender: User, name: string) {

			//search the channel by id
			const channels = await this.channelRepo.find({
				relations: ['usersRelations', 'usersRelations.user'],
				where: {
					name: name,
				}
			});

			if (channels.length === 0) {
				throw new NotFoundException('channel not found');	
			}
			const channel: Channel = channels[0];

			//check if the sender is in the channel and if is banned
			const usersRelations = channel.usersRelations;
			let	n: number;
			let flag: boolean = false;
			for (let i = 0; i < usersRelations.length; i++) {
				if (sender.id === usersRelations[i].user.id) {
					flag = true;
					n = i;
				} 
			}
			if (!flag) {
				throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
			}
			if (usersRelations[n].ban) {
			throw new HttpException('You have been banned from this channel', HttpStatus.FORBIDDEN);
			}

			//check if user is muted
			
			const mutedUntil = usersRelations[n].mutedUntil;
			const currentTime = new Date();
			currentTime.getTime();
			if (currentTime < mutedUntil) {
				throw new HttpException('You have been muted for this channel', HttpStatus.FORBIDDEN);
			}

			//create and save the message
		const message = this.messageRepo.create({content});
		message.sender = sender;
		message.reciverChannel = channel;
		message.reciverType = 'channel';

		return this.messageRepo.save(message);
	}

	async createMessageForUser(content: string, user: User, id: number) {
		const reciver = await this.userService.findOne(id);	
		
		if (!reciver) {
			throw new NotFoundException('reciver not found');
		}	

		if (reciver.id === user.id) {
			throw new BadRequestException("Can't send message to yourself");
		}

		const blocked = await this.blockRepo.findOne({
			relations: ["blocked", "blocker"],
			where: {
				blocked: user,
				blocker: reciver
			}
		});

		if (blocked) {
			throw new BadRequestException('You have been blocked by this user');	
		}

		const	message = this.messageRepo.create({content});
		message.sender = user;
		message.reciverUser = reciver;

		return this.messageRepo.save(message);
			
	}

	async getChannelMessages(user: User, name: string) {

		//search the channel by name
		const channels = await this.channelRepo.find({
			relations: ['messages', 'messages.sender', 'messages.reciverChannel', 'usersRelations', 'usersRelations.user'],
			where: {
				name: name,
			}
		});

		if (channels.length === 0) {
			throw new NotFoundException('channel not found');	
		}
		const channel = channels[0];

		const userRelations = channel.usersRelations;

		//check if user is in channel and if is banned
		let	n: number
		let flag: boolean = false;
		for (let i = 0; i < userRelations.length; i++) {
			if (user.id === userRelations[i].user.id) {
				flag = true;
				n = i;
			} 
		}
		if (!flag) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}
		if (userRelations[n].ban) {
			throw new HttpException('You have been banned from this channel', HttpStatus.FORBIDDEN);
		}
		let messages = channel.messages;
		messages.reverse();

		//check if you have blocked a user
		for (let i = 0; i < messages.length; i++) {
			let blocked = await this.blockRepo.findOne({
				relations: ["blocked", "blocker"],
				where: {
					blocked: messages[i].sender,
					blocker: user
				}
			});

			if (blocked) {
				messages[i].content = "";	
			}
			
		}

		return messages;
	}

	async getMessagesWith(user: User, id: number) {
		const reciver = await this.userService.findOne(id);
	
		if (!reciver) {
			throw new NotFoundException('reciver not found');
		}	

		const sentMessages = await this.messageRepo.find({
			relations: ['sender', 'reciverUser'],
			where: {
				reciverType: 'user',
				sender: user,
				reciverUser: reciver
			}
		});

		const recivedMessages = await this.messageRepo.find({
			relations: ['sender', 'reciverUser'],
			where: {
				reciverType: 'user',
				sender: reciver,
				reciverUser: user
			}
		});

		let conversation: Message[] = sentMessages.concat(recivedMessages);

		conversation.sort((a, b) => {
			if (a.id < b.id) {
				return -1;
			}
			else {
				return 1;
			}
		});

		return conversation;

	}

	async unbanUser(user: User, bannedName: string, channelName: string) {
			const channel =	await this.channelRepo.findOne({
			relations: ['usersRelations', 'usersRelations.user', 'adminRelations', 'adminRelations.user', 'owner'],
			where: {
				name: channelName,
			}
		});
		if (!channel) {
			throw new NotFoundException('channel not found');
		}		

		const bannedUser = await this.userService.findOneLogin(bannedName);
		if (!bannedUser) {
			throw new NotFoundException('user not found');
		}	

		//check if user is admin
		const adminRelations = channel.adminRelations;
		let flag: boolean = false;
		for (let i = 0; i < adminRelations.length; i++) {
			if (user.id === adminRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('you need to be admin', HttpStatus.FORBIDDEN);
		}

		//check if it's you
		if (bannedUser.id === user.id) {
			throw new HttpException("Can't unban yourself", HttpStatus.FORBIDDEN);
		}

		//check if user is in channel
		const userRelation = await this.usersInChannelsRepo.findOne({
			relations: ['user', 'channel'],
			where: {
				user: bannedUser,
				channel: channel
			}
		});
		if (!userRelation) {
			throw new BadRequestException('user is not in channel');
		}
		
		//check if you try to unban an admin
		const adminRelation = await this.adminsInChannelsRepo.findOne({
			where: {
				user: bannedUser,
			}
		});
		if (adminRelation && (channel.owner.id !== user.id)) {
			throw new BadRequestException('you mast be the owner to unban an admin');
		}

		return this.usersInChannelsRepo.update(userRelation.id, {
			ban: false
		});
	
	}

	async kickUser(user: User, kickedName: string, channelName: string) {
		const channel =	await this.channelRepo.findOne({
			relations: ['usersRelations', 'usersRelations.user', 'adminRelations', 'adminRelations.user', 'owner'],
			where: {
				name: channelName,
			}
		});
		if (!channel) {
			throw new NotFoundException('channel not found');
		}		

		const kickedUser = await this.userService.findOneLogin(kickedName);
		if (!kickedUser) {
			throw new NotFoundException('user not found');
		}	

		//check if user is admin
		const adminRelations = channel.adminRelations;
		let flag: boolean = false;
		for (let i = 0; i < adminRelations.length; i++) {
			if (user.id === adminRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('You need to be admin', HttpStatus.FORBIDDEN);
		}

		//check if it's you
		if (user.id === kickedUser.id) {
			throw new HttpException("Can't kick yourself", HttpStatus.FORBIDDEN);
		}

		//check if you try to kick the channel owner
		if (kickedUser.id === channel.owner.id) {
			throw new HttpException('You can not kick the channel owner', HttpStatus.FORBIDDEN);
		}

		//check if user is in channel
		const userRelation = await this.usersInChannelsRepo.findOne({
			relations: ['user', 'channel'],
			where: {
				user: kickedUser,
				channel: channel
			}
		});
		if (!userRelation) {
			throw new BadRequestException('user is not in channel');
		}

		//check if you try to kick an admin
		let adminFlag = false;
		const adminRelation = await this.adminsInChannelsRepo.findOne({
			where: {
				user: kickedUser,
			}
		});
		if (adminRelation && (channel.owner.id !== user.id)) {
			throw new BadRequestException('you mast be the owner to kick an admin');
		} else {
			adminFlag = true;
		}

		if (adminFlag) {
			await this.adminsInChannelsRepo.remove(adminRelation);
		}

		return this.usersInChannelsRepo.remove(userRelation);	

	}

	async banUser(user: User, bannedName: string, channelName: string) {
			const channel =	await this.channelRepo.findOne({
			relations: ['usersRelations', 'usersRelations.user', 'adminRelations', 'adminRelations.user', 'owner'],
			where: {
				name: channelName,
			}
		});
		if (!channel) {
			throw new NotFoundException('channel not found');
		}		

		const bannedUser = await this.userService.findOneLogin(bannedName);
		if (!bannedUser) {
			throw new NotFoundException('user not found');
		}	

		//check if user is admin
		const adminRelations = channel.adminRelations;
		let flag: boolean = false;
		for (let i = 0; i < adminRelations.length; i++) {
			if (user.id === adminRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('You need to be admin', HttpStatus.FORBIDDEN);
		}

		//check if it's you
		if (user.id === bannedUser.id) {
			throw new HttpException("Can't ban yourself", HttpStatus.FORBIDDEN);
		}

		//check if you try to ban the channel owner
		if (bannedUser.id === channel.owner.id) {
			throw new HttpException('You can not ban the channel owner', HttpStatus.FORBIDDEN);
		}

		//check if user is in channel
		const userRelation = await this.usersInChannelsRepo.findOne({
			relations: ['user', 'channel'],
			where: {
				user: bannedUser,
				channel: channel
			}
		});
		if (!userRelation) {
			throw new BadRequestException('user is not in channel');
		}
		
		//check if you try to ban an admin
		const adminRelation = await this.adminsInChannelsRepo.findOne({
			where: {
				user: bannedUser,
			}
		});
		if (adminRelation && (channel.owner.id !== user.id)) {
			throw new BadRequestException('you mast be the owner to ban an admin');
		}
		
		if (userRelation.ban) {
			throw new BadRequestException('already banned');
		}
		
		return this.usersInChannelsRepo.update(userRelation.id, {
			ban: true	
		});
	
	}

	async unmuteUser(user: User, mutedName: string, channelName: string) {
		const channel =	await this.channelRepo.findOne({
			relations: ['usersRelations', 'usersRelations.user', 'adminRelations', 'adminRelations.user', 'owner'],
			where: {
				name: channelName,
			}
		});
		if (!channel) {
			throw new NotFoundException('channel not found');
		}		

		const mutedUser = await this.userService.findOneLogin(mutedName);
		if (!mutedUser) {
			throw new NotFoundException('user not found');
		}	

		//check if you are admin
		const adminRelations = channel.adminRelations;
		let flag: boolean = false;
		for (let i = 0; i < adminRelations.length; i++) {
			if (user.id === adminRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		//check if user is in channel
		const userRelation = await this.usersInChannelsRepo.findOne({
			relations: ['user', 'channel'],
			where: {
				user: mutedUser,
				channel: channel
			}
		});
		if (!userRelation) {
			throw new BadRequestException('user is not in channel');
		}

		//check if you try to mute an admin
		const adminRelation = await this.adminsInChannelsRepo.findOne({
			where: {
				user: mutedUser,
			}
		});
		if (adminRelation && (channel.owner.id !== user.id)) {
			throw new BadRequestException('you mast be the owner to mute an admin');
		}

		return this.usersInChannelsRepo.update(userRelation.id, {	
			mutedUntil: '1996-10-28'
		});
	}

	async muteUser(user: User, mutedName: string, channelName: string, time: number) {
		const channel =	await this.channelRepo.findOne({
			relations: ['usersRelations', 'usersRelations.user', 'adminRelations', 'adminRelations.user', 'owner'],
			where: {
				name: channelName,
			}
		});
		if (!channel) {
			throw new NotFoundException('channel not found');
		}		

		const mutedUser = await this.userService.findOneLogin(mutedName);
		if (!mutedUser) {
			throw new NotFoundException('user not found');
		}		
		
		//check if user is a channel admin
		const adminRelations = channel.adminRelations;
		let flag: boolean = false;
		for (let i = 0; i < adminRelations.length; i++) {
			if (user.id === adminRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		//check if you try to mute the owner
		if (mutedUser.id === channel.owner.id) {
			throw new HttpException('You can not mute the channel owner', HttpStatus.FORBIDDEN);
		}

		const userRelation = await this.usersInChannelsRepo.findOne({
			relations: ['user', 'channel'],
			where: {
				user: mutedUser,
				channel: channel
			}
		});
		if (!userRelation) {
			throw new BadRequestException('user is not in channel');
		}

		//check if you try to unmute an admin
		const adminRelation = await this.adminsInChannelsRepo.findOne({
			where: {
				user: mutedUser,
			}
		});
		if (adminRelation && (channel.owner.id !== user.id)) {
			throw new BadRequestException('you mast be the owner to unmute an admin');
		}


		
		let currentTime = new Date();
		let timeUntilMute = new Date();
		timeUntilMute.setTime(currentTime.getTime() + (time * 60 * 1000));

		return this.usersInChannelsRepo.update(userRelation.id, {	
			mutedUntil: timeUntilMute
		});
	}

	async getOpenConversations(user: User) {

		const recived = await this.messageRepo.find({
			relations: ['sender', 'reciverUser'],
			where: {
				reciverType: 'user',
				reciverUser: user,
			}
		});	

		const sent = await this.messageRepo.find({
			relations: ['sender', 'reciverUser'],
			where: {
				reciverType: 'user',
				sender: user,
			}
		});	

		let allUsers: User[] = [];
	
		for (let i = 0; i < recived.length; i++) {
				allUsers.push(recived[i].sender);	
		}

		for (let i = 0; i < sent.length; i++) {
				allUsers.push(sent[i].reciverUser);	
		}

		let users: User[] = [];

		users[0] = allUsers[0];

		let flag: boolean = true;
		for (let i = 0; i < allUsers.length; i++) {
			flag = true;
			for (let j = 0; j < users.length; j++) {
				if (allUsers[i].id === users[j].id) {
					flag = false;
				}
			}
			if (flag) {
				users.push(allUsers[i]);
			}
		}
		
		return users;
	}

}
