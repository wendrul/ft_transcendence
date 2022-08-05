import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthecticationService {
	constructor( private usersService: UsersService ) {}

	async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(user.email, 'Transcendence', secret);

		await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

		return {
			secret,
			otpauthUrl
		};
	}

	isTwoFactorAuthenticationCodeValid(code: string, user: User) {
		return authenticator.verify({
			token: code,
			secret: user.twoFactorAuthenticationSecret
		});
	}
}
