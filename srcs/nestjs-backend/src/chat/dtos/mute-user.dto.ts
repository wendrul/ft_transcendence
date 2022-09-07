import {IsNumber, IsString} from "class-validator";


export class MuteUserDto {

	@IsString()
	user: string;

	@IsString()
	channel: string;

	@IsNumber()
	time: number;

}
