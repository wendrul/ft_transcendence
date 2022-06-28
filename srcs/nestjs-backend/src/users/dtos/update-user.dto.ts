import {IsEmail, IsOptional, IsString} from "class-validator";
import {User} from "../users.entity";

export class UpdateUserDto {
	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	password: string;
	
	@IsOptional()
	@IsString()
	login: string;

	@IsOptional()
	@IsString()
	status: string;

	@IsOptional()
	friends: User[];

	@IsOptional()
	friendOf: User[];
}
