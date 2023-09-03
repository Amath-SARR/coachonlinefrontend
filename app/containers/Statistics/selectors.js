import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the statistics state domain
 */

const selectStatisticsDomain = state => state.statistics || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Statistics
 */

const makeSelectStatistics = () =>
  createSelector(
    selectStatisticsDomain,
    substate => substate,
  );

export default makeSelectStatistics;
export { selectStatisticsDomain };
