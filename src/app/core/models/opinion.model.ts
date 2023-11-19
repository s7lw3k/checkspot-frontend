import { User } from './user.model';

export interface Opinion {
	id: number;
	issuedBy: User;
	issuedDate: Date;
	photos: string[];
	content: string;
	internetRating: number;
	neighborhoodRating: number;
	neighborRating: number;
	communicationRating: number;
	price: Price;
}

enum Price {
	'$',
	'$$',
	'$$$',
}
