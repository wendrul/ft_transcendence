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

	find(id: number) {
		return this.repo.findOne({
			loadRelationIds: true,
			where: {id : id}
		});
	}
}
