import {Body, Controller, Post} from "@nestjs/common";
import {GameService} from "./game.service";


@Controller('/game')
export class GameController {
	constructor(private gameService: GameService) {}

	@Post('/createMatch')
	async createMatch(@Body() body: {winerLogin: string, losserLogin: string, winerScore: number, losserScore: number}) {
		return this.gameService.addMatchResults(body.winerLogin, body.losserLogin, body.winerScore, body.losserScore);
	}
}
