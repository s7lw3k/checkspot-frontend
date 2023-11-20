import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSpot from './spot.reducer';
import { SpotState } from './spot.state';

export const getSelectedSpotId = (state: SpotState) => state.ids;

export const selectSpotState = createFeatureSelector<SpotState>('spots');
export const selectSpotIds = createSelector(
  selectSpotState,
  fromSpot.selectSpotIds
);
export const selectSpotEntities = createSelector(
  selectSpotState,
  fromSpot.selectSpotEntities
);
export const selectAllSpots = createSelector(
  selectSpotState,
  fromSpot.selectAllSpots
);
export const selectSpotTotal = createSelector(
  selectSpotState,
  fromSpot.selectSpotTotal
);
