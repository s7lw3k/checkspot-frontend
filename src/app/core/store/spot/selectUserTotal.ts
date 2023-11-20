import { createSelector } from '@ngrx/store';
import { selectUserState } from './spot.state';

export const selectUserTotal = createSelector(
  selectUserState,
  fromUser.selectUserTotal
);
