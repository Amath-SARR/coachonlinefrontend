import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the liveEvents state domain
 */

const selectLiveEventsDomain = state => state.liveEvents || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by LiveEvents
 */

const makeSelectLiveEvents = () =>
  createSelector(
    selectLiveEventsDomain,
    substate => substate,
  );

export default makeSelectLiveEvents;
export { selectLiveEventsDomain };
