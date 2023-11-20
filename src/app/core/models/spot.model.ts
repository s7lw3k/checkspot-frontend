import { User } from './user.model';
import { Address } from './address.model';
import { Opinion } from './opinion.model';
import { LatLng } from 'leaflet';

export interface Spot {
  id: number;
  name?: string;
  des?: string;
  address?: Address;
  issuedBy?: User;
  opinions?: Opinion[];
  coordinates: LatLng;
}
