import {IsEmail, IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
	@IsEmail()
	@ApiProperty()
	email: string;
	
	@IsString()
	@ApiProperty()
	firstName: string;

	@IsString()
	lastName: string;

	@IsString()
	@ApiProperty()
	password: string;
}
