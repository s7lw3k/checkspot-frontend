import { Spot } from '../../models/spot.model';

export interface SpotState {
  Loading: boolean;
  Loaded: boolean;
  SpotList: Spot[];
}

export const initializeState = (): SpotState => {
  return {
    SpotList: [],
    Loading: false,
    Loaded: true,
  };
};
