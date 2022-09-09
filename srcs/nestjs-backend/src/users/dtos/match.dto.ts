import {Expose, Transform} from "class-transformer";


export class MatchDto {

	@Expose()
	id: number;

	@Expose()
	winerScore: number;

	@Expose()
	losserScore: number;

	@Transform(({ obj }) => obj.winer.login)
	@Expose()
	winerLogin: string;

	@Transform(({ obj }) => obj.losser.login)
	@Expose()
	losserLogin: string;

}
