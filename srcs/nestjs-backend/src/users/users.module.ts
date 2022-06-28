import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';
import { GoogleStrategy } from './google.strategy';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
  providers: [UsersService, AuthService, GoogleStrategy]
})

export class UsersModule {
	configure(consume: MiddlewareConsumer) {
		consume.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
