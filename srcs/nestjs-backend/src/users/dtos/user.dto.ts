import { Expose } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
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
	status: string;

	@Expose()
	@ApiProperty()
	twoFactorAuthenticationFlag: boolean;

}
