import {UsersService} from './users.service';
import {randomBytes, scrypt as _scrypt} from 'crypto';
import {promisify} from 'util';
import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async login42(email: string, login: string) {
		const users = await this.usersService.findEmail(email);	

		if (users.length) {
			return users[0];
		}

		const user = await this.usersService.create(email, "", login);
		this.usersService.update(user.id, {user42: true});

		return user;
	}

	async signup(email: string, password: string, login: string) {
		const e_users = await this.usersService.findEmail(email);
		if (e_users.length) {
			throw new BadRequestException('email in use');
		}

		console.log(login);
	 	const l_users = await this.usersService.findLogin(login);
		if (l_users.length) {
			throw new BadRequestException('login in use');
		}

		const salt = randomBytes(8).toString('hex');
		const hash = (await scrypt(password, salt, 32)) as Buffer;
		const result = salt + '.' + hash.toString('hex');

		const user = await this.usersService.create(email, result, login);

		return user;
	}

	async signin(email: string, password: string, login: string) {

		if (email) {
			var [user] = await this.usersService.findEmail(email);
		} else if (login) {
			var [user] = await this.usersService.findLogin(login);
		}

		if (!user){
			throw new NotFoundException('user not found');
		}

		if (user.user42) {
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		}

		const [salt, storedHash] = user.password.split('.');
		const hash = (await scrypt(password, salt, 32)) as Buffer;

		if (storedHash !== hash.toString('hex')) {
			throw new BadRequestException('bad password');
		}
		
		return user;
	}
}
