import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { FriendRequest } from './entities/friendRequest.entity';
import { LocalFile } from './entities/localFiles.entity';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';
import { Auth42Strategy } from './auth42.strategy';
import {FriendRequestService} from './friendRequest.service';
import {FriendRequestController} from './friendRequest.controller';
import {LocalFilesService} from './localFiles.service';
import {LocalFilesController} from './localFiles.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([FriendRequest]),
		TypeOrmModule.forFeature([LocalFile]),
	],
	controllers: [
		UsersController,
		FriendRequestController,
		LocalFilesController,
	],
  providers: [
		UsersService,
		AuthService,
		FriendRequestService,
		LocalFilesService,
		Auth42Strategy,
	]
})

export class UsersModule {
	configure(consume: MiddlewareConsumer) {
		consume.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
