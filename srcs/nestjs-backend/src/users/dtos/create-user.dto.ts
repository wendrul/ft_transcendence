import {IsEmail, IsNotEmpty, IsString, NotContains} from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	@NotContains(" ")
	@ApiProperty()
	email: string;
	
	@IsString()
	@IsNotEmpty()
	@NotContains(" ")
	@ApiProperty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
	@NotContains(" ")
	@ApiProperty()
	lastName: string;

	@IsString()
	@IsNotEmpty()
	@NotContains(" ")
	@ApiProperty()
	password: string;
}
