import {
	Body,
	Controller,
	Get,
	Param,
	Post, 
} from '@nestjs/common';
import {Serialize} from 'src/interceptors/serialize.interceptor';
import {CreateUserDto} from './dtos/create-user.dto';
import {UserDto} from './dtos/user.dto';
import {UsersService} from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
	
	constructor(
		private userService: UsersService,
	) {}

	@Post('/signup')
	async createUser(@Body() body: CreateUserDto) {
		const user = await this.userService.create(body.email, body.password);
		return user;
	}

	@Get('/:id')
	findUserById(@Param('id') id: string) {}

}
