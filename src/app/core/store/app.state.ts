import { ActionReducerMap } from '@ngrx/store';
import { SpotState } from './spot/spot.state';
import { SpotReducer } from './spot/spot.reducer';

export interface AppState {
  spots: SpotState;
}

export const reducers: ActionReducerMap<AppState> = {
  spots: SpotReducer,
};
