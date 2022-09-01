import {IsOptional, IsString} from "class-validator";

export class JoinChannelDto {

	@IsString()
	name: string;
	
	@IsOptional()
	@IsString()
	password: string;

}
