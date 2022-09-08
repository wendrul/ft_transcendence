import {MiddlewareConsumer, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CurrentUserMiddleware} from "src/users/middleware/current-user.middleware";
import {Match} from "./entities/match.entity";
import {GameService} from "./game.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Match]),
	],
	providers: [
		GameService,
	]
})

export class GameModule {
	configure(consume: MiddlewareConsumer) {
		consume.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
