import {IsString} from "class-validator";


export class UnmuteUserDto {

	@IsString()
	user: string;

	@IsString()
	channel: string;


}
