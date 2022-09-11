import { PassportStrategy } from '@nestjs/passport'

import { Strategy, VerifyCallback } from 'passport-42';

import { Injectable } from '@nestjs/common'

@Injectable()

export class Auth42Strategy extends PassportStrategy(Strategy, '42') {
	constructor(){
		super({
			clientID: process.env.AUTH42_CLIENTID,
			clientSecret: process.env.AUTH42_CLIENTSECRET,
			callbackURL: process.env.AUTH42_CLIENT_CALLBACKURL,
		});

	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		const { username, name, emails, photos } = profile
		const user = {
			login: username,
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken
		}
		done(null, user);
	}
	
}
