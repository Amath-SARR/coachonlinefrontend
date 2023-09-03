import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the affiliation state domain
 */

const selectAffiliationDomain = state => state.affiliation || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Affiliation
 */

const makeSelectAffiliation = () =>
  createSelector(
    selectAffiliationDomain,
    substate => substate,
  );

export default makeSelectAffiliation;
export { selectAffiliationDomain };
