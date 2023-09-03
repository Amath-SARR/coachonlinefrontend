/*
 * CoursePage Messages
 *
 * This contains all the text for the CoursePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CoursePage';

export default defineMessages({
  getFullAccess: {
    id: `${scope}.getFullAccess`,
    defaultMessage:
      'Click on the button below to have full access to every course in Coachs-online',
  },
  getSubscription: {
    id: `${scope}.getSubscription`,
    defaultMessage: 'GET SUBSCRIPTION',
  },
  noActiveSubscription: {
    id: `${scope}.noActiveSubscription`,
    defaultMessage: "It looks like you don't have an active subscription yet!",
  },
  tryAgain: {
    id: `${scope}.tryAgain`,
    defaultMessage: 'CLICK HERE TO TRY AGAIN',
  },
});
