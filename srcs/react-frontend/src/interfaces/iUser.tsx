export interface UpdateUser {
	id?:	number;
	firstName?: string;
	lastName?: string;
	email?: string;
	login?: string;
	password?: string;
	twoF?: boolean;
}
