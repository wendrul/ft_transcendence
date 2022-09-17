import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query, 
	Session,
	UseGuards,
	Req,
	UseInterceptors,
	UploadedFile,
	Redirect,
	Res,
	BadRequestException,
	Put,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import {AuthGuardApi} from 'src/guards/auth.guard';
import {Serialize} from 'src/interceptors/serialize.interceptor';
import {CurrentUser} from './decorators/current-user.decorator';
import {CreateUserDto} from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto';
import {UserDto} from './dtos/user.dto';
import {UsersService} from './users.service';
import {User} from './entities/users.entity';
import {AuthService} from './auth.service';
import {SigninUserDto} from './dtos/signin-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { TwoFactorGuard } from 'src/guards/twoFactor.guard';
import {UserLadderDto} from './dtos/userLadder.dto';
import {MatchDto} from './dtos/match.dto';
import { session } from 'passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(
		private userService: UsersService,
		private authService: AuthService
	) {}

	@Get('/isUserBlocked/:login')
	@UseGuards(AuthGuardApi)
	async isUserBlocked(@CurrentUser() user: User, @Param('login') login: string) {
		return this.userService.isUserBlocked(user, login);		
	}

	@Get('/matchHistory/:login')
	@UseGuards(AuthGuardApi)
	@Serialize(MatchDto)
	async getMatchHistory(@Param('login') login: string) {
		return this.userService.getMatchHistory(login);
	}

	@Get('/rankPositionByLogin/:login')
	@UseGuards(AuthGuardApi)
	async getRankPosition(@Param('login') login: string) {
		return this.userService.getRankPosition(login);
	}

	@Get('/ladder')
	@Serialize(UserLadderDto)
	getLadder() {
		return this.userService.getLadder();		
	}

	// @Get('/friends')
	// @Serialize(UserDto)
	// @UseGuards(AuthGuardApi)
	// getFriends(@CurrentUser() user: User) {
	// 	return this.userService.getFriends(user)
	// }

	@Get('/whoami')
	@Serialize(UserDto)
	@UseGuards(AuthGuardApi)
	whoAmI(@CurrentUser() user: User, @Session() session: any) {
		if (!user) {
			session.userId = null;
			session.twoFactor = null;
		}
		return user;
	}

	@Get('/block/:login')
	@Serialize(UserDto)
	@UseGuards(AuthGuardApi)
	blockUser(@CurrentUser() user: User, @Param('login') login: string) {
		return this.userService.blockUser(user, login);
	}

	@Get('/unblock/:login')
	@UseGuards(AuthGuardApi)
	@Serialize(UserDto)
	unblockUser(@CurrentUser() user: User, @Param('login') login: string) {
		return this.userService.unblockUser(user, login);
	}

	@Post('/avatar')
	@Serialize(UserDto)
	@UseGuards(AuthGuardApi)
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: '/usr/src/avatars'
		})
	}))
	addAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException('Need a file');
		}
		return this.userService.addAvatar(user.id, {
			path: file.path,
			filename: file.originalname,
			mimetype: file.mimetype
		});
	}

	@UseGuards(AuthGuardApi)
	@Get('/signout')
	@Serialize(UserDto)
	signout(@Session() session: any, @CurrentUser() user: User) {
		this.userService.update(user, {online: false});
		session.userId = null;
		session.twoFactor = null;
	}

	@Post('/signup')
	@Serialize(UserDto)
	async signup(@Body() body: CreateUserDto, @Session() session: any, @CurrentUser() c_user: User) {
		session.twoFactor = null;	
		const user = await this.authService.signup(body.email, body.password, body.firstName, body.lastName);
		
		if (c_user) {
			this.userService.update(c_user, {online: false});
		}

		session.userId = user.id;

		const login: string = "User" + user.id.toString();

		this.userService.update(user, {online: true, login: login});
		return user;
	}

	@Get('/Auth42')
	@Serialize(UserDto)
	@UseGuards(AuthGuard('42'))
	async Auth42(@Req() req: any) {
	}

	@Get('auth/code')
	@Serialize(UserDto)
	async Auth42Check(@Req() req: any, @Session() session: any, @CurrentUser() c_user: User) {

		// const user = await this.userService.create(req.user.email, "", req.user.login);
		const user = await this.authService.login42(req.user.email, req.user.firstName, req.user.lastName);

		if (c_user) {
			this.userService.update(c_user, {online: false});
		}

		session.userId = user.id;
		this.userService.update(user, {online: true});
		return user;
	}


	@Get('auth/42/callback')
	@Serialize(UserDto)
	@UseGuards(AuthGuard('42'))
	async Auth42Redirect(@Res() res:any, @Req() req: any, @Session() session: any, @CurrentUser() c_user: User) {

		const user = await this.authService.login42(req.user.email, req.user.firstName, req.user.lastName);

		if (c_user) {
			this.userService.update(c_user, {online: false});
		}

		if (user.twoFactorAuthenticationFlag) {
			session.twoFactor = user.id;
			res.redirect('http://localhost:3000/Authenticate2fa?twoFactor=true');
		}
		console.log(22);
		session.userId = user.id;
		this.userService.update(user, {online: true});
		//res.redirect('http://localhost:3000');
	}


	@Post('/authApi42')
	async	authApi42(@Body() token: any) {
	} 


	@Post('/signin')
	@Serialize(UserDto)
	async	signin(@Body() body: SigninUserDto, @Session() session: any, @CurrentUser() c_user: User) {

		const user = await this.authService.signin(body.email, body.password);
//		const user = await this.authService.signin(body.email, body.password, body.login);
		session.twoFactor = null;
		if (c_user) {
			this.userService.update(c_user, {online: false});
		}

		if (user.twoFactorAuthenticationFlag) {
			session.twoFactor = user.id;
			return user;
		}

		session.userId = user.id;

		this.userService.update(user, {online: true});

		return user;
	}

	@Get('/:id')
	@Serialize(UserDto)
	async findUserById(@Param('id') id: string) {
		if (Number(id))
			var user = await this.userService.findOne(parseInt(id));
		else
			var user = await this.userService.findOneLogin(id);
		if (!user) {
			throw new NotFoundException('user not found');
		}
		return user;
	}

	@Get('/userByLogin/:login')
	@Serialize(UserDto)
	async findUserByLogin(@Param('login') login: string) {
		const user = await this.userService.findOneLogin(login);
		if (!user) {
			throw new NotFoundException('user not found');
		}
		return user;
	}

	@Get()
	@Serialize(UserDto)
	findAllUsers(@Query('email') email: string) {
		return this.userService.findEmail(email);
	}

	@Delete('/:id')
	@Serialize(UserDto)
	removeUser(@Param('id') id: string) {
		return this.userService.remove(parseInt(id));
	}

/*	
	@Patch('/:id')
	@UseGuards(AuthGuardApi)
	updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
		return this.userService.update(user.id, body);
	}
	*/

	@Patch('/myprofile')
	@Serialize(UserDto)
	@UseGuards(AuthGuardApi)
	updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
		return this.userService.update(user, body);
	}
}
