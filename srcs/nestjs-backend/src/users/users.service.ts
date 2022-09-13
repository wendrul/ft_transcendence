import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Match} from 'src/game/entities/match.entity';
import {Repository} from 'typeorm';
import {LocalFileDto} from './dtos/localFile.dto';
import {BlockedUser} from './entities/blockedUsers.entity';
import {User} from './entities/users.entity';
import {LocalFilesService} from './localFiles.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private repo: Repository<User>,
		@InjectRepository(BlockedUser) private blockRepo: Repository<BlockedUser>,
		private localFilesService: LocalFilesService,
	) {}

	async isUserBlocked(user: User, login: string) {
		const friend = await this.repo.findOneBy({login});
		if (!friend) {
				throw new NotFoundException('user not found');
		}

		const	blocked = await this.blockRepo.findOne({
			relations: ["blocked", "blocker"],
			where: {
				blocked: friend,
				blocker: user,
			}
		}); 

		if (blocked) {
			return true;
		}
		else {
			return false;
		}
	}

	async getMatchHistory(login: string) {
		const user = await this.repo.findOne({
			relations: [
				'wonMatches',
				'lostMatches',
				'wonMatches.winer',
				'wonMatches.losser',
				'lostMatches.winer',
				'lostMatches.losser',
			],
			where: {
				login: login,
			}
		});

		const wonMatches: Match[]  = user.wonMatches;		
		const lostMatches: Match[] = user.lostMatches;

		const allMatches: Match[] = [];

		for (let i = 0; i < wonMatches.length; i++) {
			allMatches.push(wonMatches[i]);
		}

		for (let i = 0; i < lostMatches.length; i++) {
			allMatches.push(lostMatches[i]);
		}

		allMatches.sort((a, b) => {
			if (a.id > b.id) {
				return 1;
			}
			else {
				return -1;
			}
		});

		return allMatches;
	}

	async getRankPosition(login: string) {
		const user = await this.repo.findOneBy({login});
		if (!user) {
			throw new NotFoundException('Usesr not found');
		}
		const allUsers: User[] = await this.repo.findBy({});

		allUsers.sort((a, b) => {
			if (a.score > b.score) {
				return -1;
			}
			else {
				return 1;
			}
		});

		let position: number;
		for (position = 0; position < allUsers.length; position++) {
			if (user.id === allUsers[position].id) {
				return (position + 1).toString();
			}
		}

		throw new BadRequestException('User not in ranking');

	}

	async getLadder() {
		const users: User[] = await this.repo.findBy({});

		users.sort((a, b) => {
			if (a.score > b.score) {
				return -1;
			}	
			else {
				return 1;
			}
		});

		let ladder: User[] = [];
		for (let i = 0; i < 10 && i < users.length; i++) {
			ladder.push(users[i]);
		}

		return ladder;

	}

	async blockUser(user: User, login: string) {

		const toBlock = await this.findOneLogin(login);	
		if (!toBlock) {
			throw new NotFoundException('User not found');
		}

		if (toBlock.id === user.id) {
			throw new BadRequestException("Can't block yourself");
		}

		const blocked = await this.blockRepo.findOne({
			relations: ["blocked", "blocker"],	
			where: {
				blocked: toBlock,
				blocker: user
			}
		});

		if (blocked) {
			throw new BadRequestException('User already blocked');
		}

		const blockedUser = this.blockRepo.create({blocked: toBlock, blocker: user});
		// blockedUser.blocked = toBlock;
		// blockedUser.blocker = user;
		return this.blockRepo.save(blockedUser);
	}

	async unblockUser(user: User, login: string) {

		const toUnblock = await this.findOneLogin(login);	
		if (!toUnblock) {
			throw new NotFoundException('User not found');
		}

		const blockedUser = await this.blockRepo.findOne({
			relations: ["blocked", "blocker"],	
			where: {
				blocked: toUnblock,
				blocker: user
			}
		});
		
		if (!blockedUser) {
			throw new BadRequestException('User was not blocked');
		}

		return this.blockRepo.remove(blockedUser);

	}

	async turnOffTwoFactorAuthentication(userId: number) {
		return this.repo.update(userId, {
			twoFactorAuthenticationFlag: false
		});
	}

	async turnOntTwoFactorAuthentication(userId: number) {
		return this.repo.update(userId, {
			twoFactorAuthenticationFlag: true	
		});
	}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		return this.repo.update(userId, {
			twoFactorAuthenticationSecret: secret
		});
	}

	async addAvatar(userId: number, fileData: LocalFileDto) {
		const avatar = await this.localFilesService.saveLocalFileData(fileData);
		await this.repo.update(userId, {
			avatarId: avatar.id,
			avatarPath: avatar.path,
			defaultAvatar: false,
			avatar: avatar,
		})
	}

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

	findOneLogin(login: string) {
		if (!login) {
			return null;
		}
		return this.repo.findOneBy({login});
	}

	findEmail(email: string) {
		return this.repo.findBy({email});
	}

	findLogin(login: string) {
		return this.repo.findBy({login});
	}

	async update(user: User, attrs: Partial<User>) {
		if (attrs.email && attrs.email != user.email) {
			
			const email = await this.findEmail(attrs.email);

			if (email.length) {
				throw new BadRequestException('email in use');
			}
		}
		if (attrs.login && attrs.login != user.login)  {
			if (Number(attrs.login))
				throw new BadRequestException(['login in a number']);
			
			const login = await this.findLogin(attrs.login);
			
			if (login.length) {
				throw new BadRequestException(['login in use']);
			}

			if (attrs.login.length > 11) {
				throw new BadRequestException(['why so long?']);
			}

		}
		if (!user)
			throw new BadRequestException(['no no no']);
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
