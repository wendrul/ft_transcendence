import {MiddlewareConsumer, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatController} from "./chat.controller";
import {Channel} from './entities/channels.entity';
import {Message} from './entities/messages.entity';
import {ChatService} from './chat.service';
import {CurrentUserMiddleware} from "src/users/middleware/current-user.middleware";
import {UsersService} from "src/users/users.service";
import {User} from 'src/users/entities/users.entity';
import {LocalFile} from 'src/users/entities/localFiles.entity';
import {LocalFilesService} from "src/users/localFiles.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel]),
		TypeOrmModule.forFeature([Message]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([LocalFile]),
	],
	controllers: [
		ChatController,
	],
	providers: [
		ChatService,
		UsersService,
		LocalFilesService,
	]
})

export class ChatModule {
	configure(consume: MiddlewareConsumer) {
		consume.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
