import {Injectable, NotFoundException} from "@nestjs/common";
import {UsersService} from "src/users/users.service";


@Injectable()
export class GameService {
	constructor(
		private userService: UsersService,
	) {}

	async createMatch() {

	}

	async userInGame(login: string) {
		const user = await this.userService.findOneLogin(login);
		if (!user) {
			throw new NotFoundException('User Not Found');
		}

		return this.userService.update(user, {inGame: true});
	}

	async userWon(login: string) {
		const user = await this.userService.findOneLogin(login);
		if (!user) {
			throw new NotFoundException('User Not Found');
		}

		const oldScore = user.score;
		const newScore = oldScore + 5;
		const wins = user.wins + 1;
		return this.userService.update(user, {wins: wins, score: newScore, inGame: false});
	}

	async userLossed(login: string) {
		const user = await this.userService.findOneLogin(login);
		if (!user) {
			throw new NotFoundException('User Not Found');
		}

		const oldScore = user.score;
		let newScore = (oldScore - 3) > 0 ? oldScore - 3 : 0;

		const losses = user.loses + 1;
		return this.userService.update(user, {loses: losses, score: newScore, inGame: false});
	}
	
}
