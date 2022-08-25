import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {FriendRequest} from "./entities/friendRequest.entity";
import {User} from "./entities/users.entity";
import {UsersService} from "./users.service";

@Injectable()
export class FriendRequestService {
	constructor(
		@InjectRepository(FriendRequest) private repo: Repository<FriendRequest>,
		private usersService: UsersService
	) {}

	async getFriendData(user: User, login: string) {

		let friend: User;

		const friends = await this.getFriends(user);

		for (let i = 0; i < friends.length; i++) {
			if (login === friends[i].login) {
				friend = friends[i];
			}	
		}

		if (friend) {
			return friend;
		} else {
			throw new BadRequestException('User is not your friend');
		}

	}

	async removeFriend(user: User, login: string) {

		const friend = await this.usersService.findOneLogin(login);	
		if (!friend) {
			throw new NotFoundException('user not found');
		}
		
		let friendRequest = await this.repo.find({
			relations: ["sender", "reciver"],
			where: {
				sender: user,
				reciver: friend,
				status: "accepted"
			}
		});

		if (friendRequest.length) {
			return this.repo.remove(friendRequest[0]);
		}

		friendRequest = await this.repo.find({
			relations: ["sender", "reciver"],
			where: {
				sender: friend,
				reciver: user,
				status: "accepted"
			}
		});

		if (friendRequest.length) {
			return this.repo.remove(friendRequest[0]);
		} else {
			throw new BadRequestException('User is not your friend');
		}
	}

	async create(user: User, login: string) {
		const reciver = await this.usersService.findLogin(login);
		if (reciver.length === 0) {
			throw new NotFoundException('user not found');
		}

		if (reciver[0].id === user.id) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		const pending = await this.repo.find({
			relations: ["reciver", "sender"],
			where: {
				sender: user,
				reciver: reciver[0],
			}
		});
		if (pending.length) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		const accepted = await this.repo.find({
			relations: ["reciver", "sender"],
			where: {
				sender: reciver[0],
				reciver: user,
			}
		});
		if (accepted.length) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		const request = this.repo.create();
		request.sender = user;
		request.reciver = reciver[0];

		return this.repo.save(request);
	}

	async changeStatus(user: User, id: number, status: string) {
		const friendRequest = await this.repo.findOne({
			relations: ['reciver', 'sender'],
			where: {id: id}
		});	

		if (!friendRequest) {
			throw new NotFoundException('request not found'); 
		}

		if (user.id !== friendRequest.reciver.id) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		if (status === "accepted") {
			friendRequest.status = status;
			return this.repo.save(friendRequest);
		}
		if (status === "rejected") {
			return this.repo.remove(friendRequest);
		}

		throw new BadRequestException('status not allowed');
	}

	async getFriends(user: User) {
		const r_req = await this.repo.find({
			relations: ['reciver', 'sender'],
			where: {
				reciver: user,
				status: 'accepted'
			}
		});  

		const s_req = await this.repo.find({
			relations: ['reciver', 'sender'],
			where: {
				sender: user,
				status: 'accepted'
			}
		});

		let friends: User[] = [];

		for (let i = 0; i < r_req.length; i++) {
			friends.push(r_req[i].sender);
		}

		for (let i = 0; i < s_req.length; i++) {
			friends.push(s_req[i].reciver);
		}

		return friends;
	}

	findPending(user: User) {

		return this.repo.find({
			relations: ['reciver', 'sender'],
			where: {
				status: 'pending',
				reciver: user,
			}
		});
	}

	find(id: number) {
		return this.repo.findOne({
			loadRelationIds: true,
			where: {id : id}
		});
	}
}
