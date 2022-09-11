import {IsEmail, IsString, ValidateIf} from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class SigninUserDto {
	@ValidateIf(o => !o.login || o.email)
	@IsEmail()
	@ApiProperty()
	email: string;
	
	@ValidateIf(o => !o.email || o.login)
	@IsString()
	@ApiProperty()
	login: string;

	@IsString()
	@ApiProperty()
	password: string;
}
