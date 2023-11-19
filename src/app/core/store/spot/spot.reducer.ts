import { Action } from '@ngrx/store';
import { SpotState, initializeState } from './spot.state';
import * as SpotActions from './spot.action';
import { Spot } from '../../models/spot.model';
import ActionWithPayload from '../action';

const initialState = initializeState();

export function SpotReducer(state: SpotState = initialState, action: Action) {
  switch (action.type) {
    case SpotActions.GET_SPOT:
      return { ...state, Loaded: false, Loading: true };

    case SpotActions.CREATE_SPOT:
      return {
        ...state,
        SpotList: state.SpotList.concat(
          (action as ActionWithPayload<Spot[]>).payload
        ),
        Loaded: false,
        Loading: true,
      };

    default:
      return state;
  }
}
