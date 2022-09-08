import {UsersService} from './users.service';
import {randomBytes, scrypt as _scrypt} from 'crypto';
import {promisify} from 'util';
import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	getCookieWithJwtToken(userId: number) {
		const payload = { userId };	
		const token = this.jwtService.sign(payload);
		return `Authentication=${token}; HttpOnly; Path=\; Max-Age=6000`;
	}

	async login42(email: string, firstName: string, lastName: string) {
		const users = await this.usersService.findEmail(email);	

		if (users.length) {
			return users[0];
		}

		const user = await this.usersService.create(email, "",  firstName, lastName);
		this.usersService.update(user, {user42: true});

		return user;
	}

	async signup(email: string, password: string, firstName: string, lastName: string) {
		const e_users = await this.usersService.findEmail(email);
		if (e_users.length) {
			throw new BadRequestException(['email in use']);
		}

	 	// const l_users = await this.usersService.findLogin(login);
		// if (l_users.length) {
			// throw new BadRequestException('login in use');
		// }

		const salt = randomBytes(8).toString('hex');
		const hash = (await scrypt(password, salt, 32)) as Buffer;
		const result = salt + '.' + hash.toString('hex');

		const user = await this.usersService.create(email, result, firstName, lastName);

		return user;
	}

	async signin(email: string, password: string) {

		if (email) {
			var [user] = await this.usersService.findEmail(email);
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
