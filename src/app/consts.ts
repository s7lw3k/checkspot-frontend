const API_URL = 'http://localhost:4000';
export const environment = {
	production: true,
	apiUrl: API_URL,
};
export interface RegUser {
	name: string;
	mail: string;
	password: string;
}
export interface LoginUser {
	mail: string;
	password: string;
}
