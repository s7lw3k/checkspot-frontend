import { Action } from '@ngrx/store';
import { SpotState, adapter, initialState } from './spot.state';
import {
  AddSpot,
  AddSpots,
  SpotActionTypes,
  SpotActionsUnion,
} from './spot.action';

export function SpotReducer(state = initialState, action: Action): SpotState {
  switch (action.type) {
    case SpotActionTypes.GET_SPOT:
      return { ...state, Loaded: false, Loading: true };

    case SpotActionTypes.ADD_SPOT:
      return adapter.addOne((action as AddSpot).payload.spot, state);

    case SpotActionTypes.ADD_SPOTS:
      return adapter.addMany((action as AddSpots).payload.spots, state);
    default:
      return state;
  }
}
