import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import {APP_PIPE} from '@nestjs/core';
import {FriendRequest} from './users/friendRequest.entity';
import { ConfigModule } from '@nestjs/config';
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
			entities: [User, FriendRequest],
			synchronize: true
		}),
		UsersModule],
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
