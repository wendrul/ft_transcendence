import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UsersService} from "src/users/users.service";
import {Repository} from "typeorm";
import {Match} from "./entities/match.entity";


@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Match) private matchRepo: Repository<Match>,
		private userService: UsersService,
	) {}

	async addMatchResults(winerLogin: string, losserLogin: string, winerScore: number, losserScore: number) {

		//find wienr and losser
		await this.userLost(losserLogin);
		await this.userWon(winerLogin);
		const winer = await this.userService.findOneLogin(winerLogin);
		if (!winer) {
			throw new NotFoundException('User Not Found');
		}
		const losser = await this.userService.findOneLogin(losserLogin);
		if (!losser) {
			throw new NotFoundException('User Not Found');
		}

		const match = this.matchRepo.create({winer, losser, winerScore, losserScore});
		await this.matchRepo.save(match);

		return match;
	}

	//==========Uncoment to add game room===========
	async userInGame(login: string, gameRoom: string) {
		const user = await this.userService.findOneLogin(login);
		if (!user) {
			throw new NotFoundException('User Not Found');
		}

		return this.userService.update(user, {inGame: true, gameRoom: gameRoom});
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

	async userDisconnectOnAbort(login: string) {
		const user = await this.userService.findOneLogin(login);
		if (!user) {
			throw new NotFoundException('User Not Found');
		}
		return this.userService.update(user, {inGame: false});
	}

	async userLost(login: string) {
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
