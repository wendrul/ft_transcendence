import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/users.entity';
import {APP_PIPE} from '@nestjs/core';
import {FriendRequest} from './users/entities/friendRequest.entity';
import {LocalFile} from './users/entities/localFiles.entity';
import { ConfigModule } from '@nestjs/config';
import {Channel} from './chat/entities/channels.entity';
import {Message} from './chat/entities/messages.entity';
import {ChatModule} from './chat/chat.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
	  	ConfigModule.forRoot({ envFilePath: '.env' }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_DB_HOST,
			port: Number.parseInt(process.env.POSTGRES_DB_PORT),
			username: process.env.POSTGRES_DB_USERNAME,
			password: process.env.POSTGRES_DB_PASSWORD,
			database: process.env.POSTGRES_DB_DATABASE,
			entities: [User, FriendRequest, LocalFile, Channel, Message],
			synchronize: true
		}),
		UsersModule,
		ChatModule,
	],
  controllers: [AppController],
  providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
			})
		}	
	],
})

export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(
			cookieSession({
				keys: ['asdflkjn'],
			})).forRoutes('*');
	}
}
