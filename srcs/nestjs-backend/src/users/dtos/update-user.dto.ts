import {IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, NotContains} from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {
/*
	@IsOptional()
	@IsEmail()
	@ApiProperty()
	email: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	password: string;
	
*/
	@IsOptional()
	@IsString()
	@ApiProperty()
	@IsNotEmpty()
	firstName: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	@IsNotEmpty()
	lastName: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	@IsNotEmpty()
	@NotContains(" ")
	login: string;

	@IsOptional()
	@IsBoolean()
	@ApiProperty()
	online: boolean;
}
