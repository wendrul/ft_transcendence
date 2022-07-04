import {HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {FriendRequest} from "./friendRequest.entity";
import {User} from "./users.entity";
import {UsersService} from "./users.service";

@Injectable()
export class FriendRequestService {
	constructor(
		@InjectRepository(FriendRequest) private repo: Repository<FriendRequest>,
		private usersService: UsersService
	) {}

	async create(user: User, login: string) {
		const reciver = await this.usersService.findLogin(login);
		if (reciver.length === 0) {
			throw new NotFoundException('user not found');
		}

		if (reciver[0].id === user.id) {
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

		friendRequest.status = status;
		return this.repo.save(friendRequest);
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
