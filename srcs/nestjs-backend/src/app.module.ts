import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import {APP_PIPE} from '@nestjs/core';
import {FriendRequest} from './users/friendRequest.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres',
			port: 5432,
			username: 'root',
			password: 'root',
			database: 'db',
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
