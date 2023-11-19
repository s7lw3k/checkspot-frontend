export interface User {
	id: number;
	name: string;
	mail: string;
	password: string;
	createdDate: Date;
	darkMode: boolean;
	isLogin?: boolean;
}
