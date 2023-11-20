import {
  Dictionary,
  EntityAdapter,
  EntityState,
  createEntityAdapter,
} from '@ngrx/entity';
import { Spot } from '../../models/spot.model';

export const adapter: EntityAdapter<Spot> = createEntityAdapter<Spot>();
export interface SpotState extends EntityState<Spot> {
  Loading: boolean;
  Loaded: boolean;
  ids: string[] | number[];
}

export const initialState: SpotState = adapter.getInitialState({
  Loading: false,
  Loaded: true,
  ids: [],
  Spots: {},
});
