import {Expose} from "class-transformer";


export class UserLadderDto {

	@Expose()
	login: string;

	@Expose()
	wins: number;

	@Expose()
	loses: number;

	@Expose()
	score: number;

}
