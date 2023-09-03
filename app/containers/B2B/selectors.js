import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the b2B state domain
 */

const selectB2BDomain = (state) => state.b2B || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by B2B
 */

const makeSelectB2B = () => createSelector(selectB2BDomain, (substate) => substate);

export default makeSelectB2B;
export { selectB2BDomain };
