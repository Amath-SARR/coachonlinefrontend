/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.HomePage';

export default defineMessages({
  coaches: {
    id: `${scope}.coaches`,
    defaultMessage: 'Coachs',
  },
  contactUs: {
    id: `${scope}.contactUs`,
    defaultMessage: 'Contact us',
  },
  continueLearning: {
    id: `${scope}.continueLearning`,
    defaultMessage: 'Continue learning',
  },
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the HomePage container!',
  },
  information: {
    id: `${scope}.information`,
    defaultMessage: 'Information',
  },
  seeMore: {
    id: `${scope}.seeMore`,
    defaultMessage: 'See more',
  },
  suggestedCourses: {
    id: `${scope}.suggestedCourses`,
    defaultMessage: 'Suggested courses',
  },
  watch: {
    id: `${scope}.watch`,
    defaultMessage: 'Watch',
  },
});
