import { User } from './user.model';
import { Opinion } from './opinion.model';
import { LatLng } from 'leaflet';

export interface Spot {
  id: number;
  name?: string;
  des?: string;
  // address?: Address;
  issuedBy?: User;
  opinion?: Opinion;
  coordinates: LatLng;
}
