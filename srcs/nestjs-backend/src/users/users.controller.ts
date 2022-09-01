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

@ApiTags('Users')
@Controller('users')
@Serialize(UserDto)
export class UsersController {
	constructor(
		private userService: UsersService,
		private authService: AuthService
	) {}

	@Get('/test')
	@UseGuards(TwoFactorGuard)
	test(@Session() session: any) {
		console.log(session.twoFactor);
	}

	@Get('/friends')
	@UseGuards(AuthGuardApi)
	getFriends(@CurrentUser() user: User) {
		return this.userService.getFriends(user)
	}

	@Get('/whoami')
	@UseGuards(AuthGuardApi)
	whoAmI(@CurrentUser() user: User) {
		return user;
	}

	@Post('/block/:login')
	@UseGuards(AuthGuardApi)
	blockUser(@CurrentUser() user: User, @Param('login') login: string) {
		return this.userService.blockUser(user, login);
	}

	@Post('/unblock/:login')
	@UseGuards(AuthGuardApi)
	unblockUser(@CurrentUser() user: User, @Param('login') login: string) {
		return this.userService.unblockUser(user, login);
	}

	@Post('/avatar')
	@UseGuards(AuthGuardApi)
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: '/usr/src/avatars'
		})
	}))
	addAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
		return this.userService.addAvatar(user.id, {
			path: file.path,
			filename: file.originalname,
			mimetype: file.mimetype
		});
	}

	@UseGuards(AuthGuardApi)
	@Get('/signout')
	signout(@Session() session: any, @CurrentUser() user: User) {
		this.userService.update(user, {status: 'offline'});
		session.userId = null;
		session.twoFactor = null;
	}

	@Post('/signup')
	async signup(@Body() body: CreateUserDto, @Session() session: any, @CurrentUser() c_user: User) {
		session.twoFactor = null;	
		const user = await this.authService.signup(body.email, body.password, body.firstName, body.lastName);
		
		if (c_user) {
			this.userService.update(c_user, {status: 'offline'});
		}

		session.userId = user.id;

		const login: string = "User" + user.id.toString();

		this.userService.update(user, {status: 'online', login: login});
		return user;
	}

	@Get('/Auth42')
	@UseGuards(AuthGuard('42'))
	async Auth42(@Req() req: any) {
	}

	@Get('auth/code')
	async Auth42Check(@Req() req: any, @Session() session: any, @CurrentUser() c_user: User) {

		// const user = await this.userService.create(req.user.email, "", req.user.login);
		const user = await this.authService.login42(req.user.email, req.user.firstName, req.user.lastName);

		if (c_user) {
			this.userService.update(c_user, {status: 'offline'});
		}

		session.userId = user.id;
		this.userService.update(user, {status: 'online'});
		return user;
	}


	@Get('auth/42/callback')
	@UseGuards(AuthGuard('42'))
	async Auth42Redirect(@Res() res:any, @Req() req: any, @Session() session: any, @CurrentUser() c_user: User) {

		console.log(req)
		const user = await this.authService.login42(req.user.email, req.user.firstName, req.user.lastName);

		if (c_user) {
			this.userService.update(c_user, {status: 'offline'});
		}

		if (user.twoFactorAuthenticationFlag) {
			session.twoFactor = user.id;
		}

		session.userId = user.id;
		this.userService.update(user, {status: 'online'});
		res.redirect('http://localhost:3000');
	}


	@Post('/authApi42')
	async	authApi42(@Body() token: any) {
		console.log(token);
	} 


	@Post('/signin')
	async	signin(@Body() body: SigninUserDto, @Session() session: any, @CurrentUser() c_user: User) {

		const user = await this.authService.signin(body.email, body.password);
//		const user = await this.authService.signin(body.email, body.password, body.login);
		session.twoFactor = null;
		if (c_user) {
			this.userService.update(c_user, {status: 'offline'});
		}

		if (user.twoFactorAuthenticationFlag) {
			session.twoFactor = user.id;
			return user;
		}

		session.userId = user.id;

		this.userService.update(user, {status: 'online'});

		return user;
	}

	@Get('/:id')
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

	@Get()
	findAllUsers(@Query('email') email: string) {
		return this.userService.findEmail(email);
	}

	@Delete('/:id')
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
	@UseGuards(AuthGuardApi)
	updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
		console.log(body)
		return this.userService.update(user, body);
	}
}
