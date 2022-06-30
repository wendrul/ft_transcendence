import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './users.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) {}

	create(email: string, password: string, login: string) {
		const user = this.repo.create({ email, password, login });

		return this.repo.save(user);
	}

	findOne(id: number) {
		if (!id) {
			return null;
		}

		return this.repo.findOneBy({id});
	}

	googleLogin(req) {
		if (!req.user) {
		  return 'No user from google'
		}
		return {
		  message: 'User Info from Google',
		  user: req.user
		}
	  }

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
