import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Res,
	Session,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import {AuthGuardApi} from "src/guards/auth.guard";
import {CurrentUser} from "./decorators/current-user.decorator";
import {User} from "./entities/users.entity";
import {TwoFactorAuthecticationService} from "./twoFactorAuthentication.service";
import {Response} from 'express';
import {UsersService} from "./users.service";
import {TwoFactorGuard} from "src/guards/twoFactor.guard";
import {Serialize} from "src/interceptors/serialize.interceptor";
import {UserDto} from "./dtos/user.dto";

@Controller('2fa')
export class TwoFactorAuthenticationController {
	constructor(
		private twoFactorAuthenticationService: TwoFactorAuthecticationService,	
		private usersService: UsersService,
	) {}

	@Get('generate')
	@UseGuards(AuthGuardApi)
	async register(@Res() response: Response, @CurrentUser() user: User) {
		const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);

		return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post('turn-on')	
	@HttpCode(200)
	@UseGuards(AuthGuardApi)
	async turnOnTwoFactorAuthentication(@CurrentUser() user: User, @Body() body: { code: string }) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(body.code, user);

		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}

		await this.usersService.turnOntTwoFactorAuthentication(user.id);
	}

	@Get('turn-off')
	@HttpCode(200)
	@UseGuards(AuthGuardApi)
	async turnOffTwoFactorAuthentication(@CurrentUser() user: User) {
		await this.usersService.turnOffTwoFactorAuthentication(user.id);
	}

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(TwoFactorGuard)
	@Serialize(UserDto)
	async authenticate(@Session() session: any, @Body() body: { code: string }) {
		const user = await this.usersService.findOne(session.twoFactor);
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(body.code, user);	

		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}

		session.userId = session.twoFactor;

		this.usersService.update(user, {online: true});

		return user;
	}
}
