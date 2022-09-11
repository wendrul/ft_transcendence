import {MiddlewareConsumer, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CurrentUserMiddleware} from "src/users/middleware/current-user.middleware";
import {Match} from "./entities/match.entity";
import {GameService} from "./game.service";
import {User} from "../users/entities/users.entity";
import { UsersService } from "src/users/users.service";
import { LocalFilesService } from "src/users/localFiles.service";
import { Channel } from "src/chat/entities/channels.entity";
import { Message } from "src/chat/entities/messages.entity";
import { LocalFile } from "src/users/entities/localFiles.entity";
import { AdminsInChannels } from "src/chat/entities/adminsInChannels.entity";
import { UsersInChannels } from "src/chat/entities/usersInChannels.entity";
import { BlockedUser } from "src/users/entities/blockedUsers.entity";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";

@Module({
	imports: [
		TypeOrmModule.forFeature([Match]),
		TypeOrmModule.forFeature([User]),

		TypeOrmModule.forFeature([Channel]),
		TypeOrmModule.forFeature([Message]),
		TypeOrmModule.forFeature([LocalFile]),
		TypeOrmModule.forFeature([AdminsInChannels]),
		TypeOrmModule.forFeature([UsersInChannels]),
		TypeOrmModule.forFeature([BlockedUser]),

	],
	controllers: [
		GameController,
	],
	providers: [
		GameService,
		UsersService,
		LocalFilesService,
		GameGateway
	]
})

export class GameModule {
	configure(consume: MiddlewareConsumer) {
		consume.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
