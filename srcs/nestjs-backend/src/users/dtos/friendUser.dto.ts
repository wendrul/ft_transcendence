import { Expose } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger"
import {LocalFile} from '../entities/localFiles.entity';

export class FriendUserDto {
	@Expose()
	@ApiProperty()
	id: number;

	@Expose()
	@ApiProperty()
	email: string;

	@Expose()
	@ApiProperty()
	firstName: string;
	
	@Expose()
	@ApiProperty()
	lastName: string;

	@Expose()
	@ApiProperty()
	login: string;

	@Expose()
	@ApiProperty()
	twoFactorAuthenticationFlag: boolean;

	@Expose()
	@ApiProperty()
	avatarPath: string;

	@Expose()
	@ApiProperty()
	online: boolean;

	@Expose()
	@ApiProperty()
	inGame: boolean;

	@Expose()
	@ApiProperty()
	wins: number;

	@Expose()
	@ApiProperty()
	loses: number;

	@Expose()
	@ApiProperty()
	score: number;

	@Expose()
	@ApiProperty()
	gameRoom: string;
}
