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
import {TwoFactorAuthenticationController} from './twoFactorAuthentication.controller';
import {TwoFactorAuthecticationService} from './twoFactorAuthentication.service';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './jwt.strategy';
import {BlockedUser} from './entities/blockedUsers.entity';
import {Match} from 'src/game/entities/match.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([FriendRequest]),
		TypeOrmModule.forFeature([LocalFile]),
		TypeOrmModule.forFeature([BlockedUser]),
		TypeOrmModule.forFeature([Match]),
		JwtModule.registerAsync({
			useFactory: async () => ({
				secret: process.env.AUTH42_CLIENTSECRET,
				signOptions: {
					expiresIn: '6000s',
				},
			}),
		})
	],
	controllers: [
		UsersController,
		FriendRequestController,
		LocalFilesController,
		TwoFactorAuthenticationController,
	],
  providers: [
		UsersService,
		AuthService,
		FriendRequestService,
		LocalFilesService,
		Auth42Strategy,
		TwoFactorAuthecticationService,
		JwtStrategy,
	]
})

export class UsersModule {
	configure(consume: MiddlewareConsumer) {
		consume.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
