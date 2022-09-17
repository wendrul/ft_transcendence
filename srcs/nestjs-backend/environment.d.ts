declare namespace NodeJS {
	export interface ProcessEnv {
		POSTGRES_DB_HOST?: string;
		POSTGRES_DB_PORT?: string;
		POSTGRES_DB_USERNAME?: string;
		POSTGRES_DB_PASSWORD?: string;
		POSTGRES_DB_DATABASE?: string;
		AUTH42_CLIENTID?: string;
		AUTH42_CLIENTSECRET?: string;
		AUTH42_CLIENT_CALLBACKURL?: string;
		COOKIES_SECRET?: string;
	}
}
