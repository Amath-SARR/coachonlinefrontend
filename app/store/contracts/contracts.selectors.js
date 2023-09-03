import { createSelector } from 'reselect';
import { initialState } from './contracts.slice';

/**
 * Direct selector to the statistics domain
 */

const selectContractsDomain = (state) => state.contracts || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Statistics
 */

const makeSelectContracts = () => createSelector(selectContractsDomain, (substate) => substate);

export default makeSelectContracts;
export { selectContractsDomain };
