import { User } from './user.model';
import { Opinion } from './opinion.model';
import { LatLng } from 'leaflet';
import { Address } from './address.model';

export interface Spot {
  id: number;
  address: Address;
  issuedBy: User;
  opinion: Opinion;
  issuedDate: Date;
  coordinates: LatLng;
}
