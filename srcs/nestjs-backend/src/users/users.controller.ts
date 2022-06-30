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
} from '@nestjs/common';
import {AuthGuardApi} from 'src/guards/auth.guard';
import {Serialize} from 'src/interceptors/serialize.interceptor';
import {CurrentUser} from './decorators/current-user.decorator';
import {CreateUserDto} from './dtos/create-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto';
import {UserDto} from './dtos/user.dto';
import {UsersService} from './users.service';
import {User} from './users.entity';
import {AuthService} from './auth.service';
import {SigninUserDto} from './dtos/signin-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
	constructor(
		private userService: UsersService,
		private authService: AuthService
	) {}

	@Get('/whoami')
	@UseGuards(AuthGuardApi)
	whoAmI(@CurrentUser() user: User) {
		return user;
	}

	@UseGuards(AuthGuardApi)
	@Post('/signout')
	signout(@Session() session: any, @CurrentUser() user: User) {
		this.userService.update(user.id, {status: 'offline'});
		session.userId = null;
	}

	@Post('/signup')
	async signup(@Body() body: CreateUserDto, @Session() session: any, @CurrentUser() c_user: User) {
		if (c_user) {
			this.userService.update(c_user.id, {status: 'offline'});
		}
		
		const user = await this.authService.signup(body.email, body.password, body.login);
		session.userId = user.id;

		this.userService.update(user.id, {status: 'online'});
		return user;
	}

	@Get('/googleAuth') //por el momento
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Req() req) {}

	@Get('auth/google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthRedirect(@Req() req: any, @Session() session: any, @CurrentUser() c_user: User) {
		if (c_user) {
			this.userService.update(c_user.id, {status: 'offline'});
		}
	//	console.log(req.user)
		const user = await this.userService.create(req.user.email, "", req.user.firstName);
		session.userId = user.id;
	//	const user = this.userService.create(req.email, null, req.email);
	
		this.userService.update(user.id, {status: 'online'});
	
		return user;

	}


	@Post('/signin')
	async	signin(@Body() body: SigninUserDto, @Session() session: any, @CurrentUser() c_user: User) {
		if (c_user) {
			this.userService.update(c_user.id, {status: 'offline'});
		}

		const user = await this.authService.signin(body.email, body.password, body.login);
		session.userId = user.id;

		this.userService.update(user.id, {status: 'online'});

		return user;
	} 

	@Get('/:id')
	async findUserById(@Param('id') id: string) {
		const user = await this.userService.findOne(parseInt(id));
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

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.userService.update(parseInt(id), body);
	}
}
