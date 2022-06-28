import { PassportStrategy } from '@nestjs/passport'

import { Strategy, VerifyCallback } from 'passport-google-oauth20'

import { Injectable } from '@nestjs/common'

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(){
		super({
			clientID: "237706590451-el0c12rtaapt94s601feion13fniao16.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "http://localhost:3000/users/auth/google/callback",
			scope: ['email', 'profile']
		});

	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
		const { name, emails, photos } = profile
		const user = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken
		}
		done(null, user);
	}
}