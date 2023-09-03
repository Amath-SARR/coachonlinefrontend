import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the libraries state domain
 */

const selectLibrariesDomain = state => state.libraries || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Libraries
 */

const makeSelectLibraries = () =>
  createSelector(
    selectLibrariesDomain,
    substate => substate,
  );

export default makeSelectLibraries;
export { selectLibrariesDomain };
