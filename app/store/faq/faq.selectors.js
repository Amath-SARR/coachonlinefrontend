import { createSelector } from 'reselect';
import { initialState } from './faq.slice';

/**
 * Direct selector to the statistics domain
 */

const selectFaqDomain = (state) => state.faq || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Statistics
 */

const makeSelectFaq = () => createSelector(selectFaqDomain, (substate) => substate);

export default makeSelectFaq;
export { selectFaqDomain };
