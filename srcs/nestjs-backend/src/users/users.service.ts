import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './users.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) {}

	async getFriends(user: User) {
		const t_user = await this.repo.findOne({
			relations: ['sentFriendRequests', 'recivedFriendRequests'],
			where: {id: user.id},
		});

		return t_user.recivedFriendRequests;
	}

	create(email: string, password: string, firstName: string, lastName: string) {
		const user = this.repo.create({ email, password, firstName, lastName });

		return this.repo.save(user);
	}

	findOne(id: number) {
		if (!id) {
			return null;
		}

		return this.repo.findOneBy({id});
	}

	// auth42Login(req) {
	// 	if (!req.user) {
	// 	  return 'No user from 42'
	// 	}
	// 	return {
	// 	  message: 'User Info from 42',
	// 	  user: req.user
	// 	}
	//   }

	findEmail(email: string) {
		return this.repo.findBy({email});
	}

	findLogin(login: string) {
		return this.repo.findBy({login});
	}

	async update(id: number, attrs: Partial<User>) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('user not found');
		}

		if (attrs.login) {
			
			const login = await this.findLogin(attrs.login);

			if (login.length) {
				throw new BadRequestException('login in use');
			}

		}

		Object.assign(user, attrs);
		return this.repo.save(user);	
	}

	async remove(id: number) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('user not found');
		}
		return this.repo.remove(user);
	}
}
