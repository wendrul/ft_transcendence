import {IsEmail, IsString, ValidateIf} from "class-validator";

export class SigninUserDto {
	@ValidateIf(o => !o.login || o.email)
	@IsEmail()
	email: string;
	
	@ValidateIf(o => !o.email || o.login)
	@IsString()
	login: string;

	@IsString()
	password: string;
}
