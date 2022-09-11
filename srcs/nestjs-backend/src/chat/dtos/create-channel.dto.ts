import {IsArray, IsString} from "class-validator";

export class CreateChannelDto {

	@IsString()
	name: string;
	
	@IsArray()
	userLogins: string[];

	@IsString()
	access: string;

	@IsString()
	password: string;
}
