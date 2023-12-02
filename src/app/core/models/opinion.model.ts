import { User } from './user.model';

export interface Opinion {
  photos?: string[];
  shortContent?: string;
  content?: string;
  internetRating: number;
  neighborhoodRating: number;
  neighborRating: number;
  communicationRating: number;
  price?: Price;
}

export enum Price {
  '$',
  '$$',
  '$$$',
}
