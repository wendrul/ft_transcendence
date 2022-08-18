import {
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "src/users/entities/users.entity";
import {UsersService} from "src/users/users.service";
import {Repository} from "typeorm";
import {Channel} from "./entities/channels.entity";
import {Message} from "./entities/messages.entity";

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Message) private messageRepo: Repository<Message>,
		@InjectRepository(Channel) private channelRepo: Repository<Channel>,
		private userService: UsersService,
	) {}

	async createMessageForUser(content: string, user: User, id: number) {
		const reciver = await this.userService.findOne(id);	
		
		if (!reciver) {
			throw new NotFoundException('reciver not found');
		}	

		const	message = this.messageRepo.create({content});
		message.sender = user;
		message.reciverUser = reciver;

		return this.messageRepo.save(message);
			
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
