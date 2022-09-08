import {MiddlewareConsumer, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CurrentUserMiddleware} from "src/users/middleware/current-user.middleware";
import {Match} from "./entities/match.entity";
import {GameService} from "./game.service";
import {User} from "../users/entities/users.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Match]),
		TypeOrmModule.forFeature([User]),
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
