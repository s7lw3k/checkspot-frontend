import { Action } from '@ngrx/store';
import { Spot } from '../../models/spot.model';

export enum SpotActionTypes {
  GET_SPOT = '[Spot] GET_SPOT',
  ADD_SPOT = '[Spot] ADD_SPOT',
  ADD_SPOTS = '[Spot] ADD_SPOTS',
}
export class GetSpot implements Action {
  readonly type = SpotActionTypes.GET_SPOT;

  constructor() {}
}
export class AddSpot implements Action {
  readonly type = SpotActionTypes.ADD_SPOT;

  constructor(public payload: { spot: Spot }) {}
}
export class AddSpots implements Action {
  readonly type = SpotActionTypes.ADD_SPOTS;

  constructor(public payload: { spots: Spot[] }) {}
}

export type SpotActionsUnion = GetSpot | AddSpot | AddSpots;
