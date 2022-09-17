import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/users.entity';
import { APP_PIPE } from '@nestjs/core';
import { FriendRequest } from './users/entities/friendRequest.entity';
import { LocalFile } from './users/entities/localFiles.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Channel } from './chat/entities/channels.entity';
import { Message } from './chat/entities/messages.entity';
import { ChatModule } from './chat/chat.module';
import { AdminsInChannels } from './chat/entities/adminsInChannels.entity';
import { UsersInChannels } from './chat/entities/usersInChannels.entity';
import { BlockedUser } from './users/entities/blockedUsers.entity';
import { Match } from './game/entities/match.entity';
import { GameModule } from './game/game.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({ 
			isGlobal: true,
			envFilePath: '.env' 
	}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: Number.parseInt(process.env.POSTGRES_DB_PORT),
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: process.env.POSTGRES_DB_DATABASE,
      entities: [
        User,
        FriendRequest,
        LocalFile,
        Channel,
        Message,
        AdminsInChannels,
        UsersInChannels,
        BlockedUser,
        Match,
      ],
      synchronize: true,
    }),
    UsersModule,
    ChatModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})

export class AppModule {
	constructor(
		private configService: ConfigService,
	) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIES_SECRET')],
        }),
      )
      .forRoutes('*');
  }
}
