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
		const userRelations = channel.usersRelations;
		let flag: boolean = false;
		for (let i = 0; i < userRelations.length; i++) {
			if (user.id === userRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

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

		//add new admin
		const adminInChannel = this.adminsInChannelsRepo.create({ user: newAdmin, channel });
		return this.adminsInChannelsRepo.save(adminInChannel);

	}

	async createMessageForChannel(content: string, sender: User, id: number) {

		//search the channel by id
		const channels = await this.channelRepo.find({
			relations: ['usersRelations', 'usersRelations.user'],
			where: {
				id: id,
			}
		});

		if (channels.length === 0) {
			throw new NotFoundException('channel not found');	
		}
		const channel: Channel = channels[0];

		//check if the sender is in the channel
		const usersRelations = channel.usersRelations;
		let flag: boolean = false;
		for (let i = 0; i < usersRelations.length; i++) {
			if (sender.id === usersRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
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

		//check if user is in channel
		const userRelations = channel.usersRelations;
		let flag: boolean = false;
		for (let i = 0; i < userRelations.length; i++) {
			if (user.id === userRelations[i].user.id) {
				flag = true;
			} 
		}
		if (!flag) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		return channel.messages;

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
