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
	UploadedFiles,
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
import {User} from './users.entity';
import {AuthService} from './auth.service';
import {SigninUserDto} from './dtos/signin-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
@Serialize(UserDto)
export class UsersController {
	constructor(
		private userService: UsersService,
		private authService: AuthService
	) {}

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

// 	@Post('/avatar')
// 	@UseGuards(AuthGuardApi)
// 	@UseInterceptors(FileInterceptor('file', {
// 		storage: diskStorage({
// 			destination: '/src/usr/avatars'
// 		})
// 	}))
// 	addAvatar(@CurrentUser() user: User) {}

	@UseGuards(AuthGuardApi)
	@Get('/signout')
	signout(@Session() session: any, @CurrentUser() user: User) {
		this.userService.update(user.id, {status: 'offline'});
		session.userId = null;
	}

	@Post('/signup')
	async signup(@Body() body: CreateUserDto, @Session() session: any, @CurrentUser() c_user: User) {
		
		const user = await this.authService.signup(body.email, body.password, body.firstName, body.lastName);
		
		if (c_user) {
			this.userService.update(c_user.id, {status: 'offline'});
		}

		session.userId = user.id;

		this.userService.update(user.id, {status: 'online'});
		return user;
	}

	@Get('/Auth42')
	@UseGuards(AuthGuard('42'))
	async Auth42(@Req() req: any) {
	}

	@Get('auth/42/callback')
	@UseGuards(AuthGuard('42'))
	async Auth42Redirect(@Req() req: any, @Session() session: any, @CurrentUser() c_user: User) {

		// const user = await this.userService.create(req.user.email, "", req.user.login);
		const user = await this.authService.login42(req.user.email, req.user.firstName, req.user.lastName);

		if (c_user) {
			this.userService.update(c_user.id, {status: 'offline'});
		}

		session.userId = user.id;
		this.userService.update(user.id, {status: 'online'});
		return user;
	}

	@Post('/signin')
	async	signin(@Body() body: SigninUserDto, @Session() session: any, @CurrentUser() c_user: User) {

		const user = await this.authService.signin(body.email, body.password);

		if (c_user) {
			this.userService.update(c_user.id, {status: 'offline'});
		}

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
	@UseGuards(AuthGuardApi)
	updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
		return this.userService.update(user.id, body);
	}
}
