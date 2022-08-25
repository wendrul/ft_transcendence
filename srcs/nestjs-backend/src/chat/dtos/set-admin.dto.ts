import {IsString} from "class-validator";


export class SetAdminDto {

	@IsString()
	name: string;

	@IsString()
	login: string;

}
