import {IsEmail, IsString} from "class-validator";

export class CreateUserDto {
	@IsEmail()
	email: string;
	
	@IsString()
	login: string;

	@IsString()
	password: string;
}
