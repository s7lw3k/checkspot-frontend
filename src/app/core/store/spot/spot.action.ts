import { Action } from '@ngrx/store';
import ActionWithPayload from '../action';
import { Spot } from '../../models/spot.model';

export const GET_SPOT = '[Spot] GET_SPOT';
export const CREATE_SPOT = '[Spot] CREATE_SPOT';

export class GetSpot implements Action {
  readonly type = GET_SPOT;

  constructor() {}
}

export class CreateSpot implements ActionWithPayload<Spot> {
  readonly type = CREATE_SPOT;
  payload: Spot;

  constructor(payload: Spot) {
    this.payload = payload;
  }
}

export type All = GetSpot | CreateSpot;
