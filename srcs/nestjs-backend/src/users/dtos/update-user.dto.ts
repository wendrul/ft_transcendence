import {IsEmail, IsOptional, IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {
	@IsOptional()
	@IsEmail()
	@ApiProperty()
	email: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	password: string;
	
	@IsOptional()
	@IsString()
	@ApiProperty()
	login: string;

	@IsOptional()
	@IsString()
	@ApiProperty()
	status: string;
}
