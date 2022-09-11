import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UsersService} from "./users.service";
import {Request} from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor( private usersService: UsersService ) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Autentication;
			}]),
			secretOrKey: process.env.AUTH42_CLIENTSECRET
		});
	}

	async validate(payload: { userId: number }) {
		return this.usersService.findOne(payload.userId);
	}
}
