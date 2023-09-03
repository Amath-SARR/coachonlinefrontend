/*
 * DropdownProfile Messages
 *
 * This contains all the text for the DropdownProfile component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.DropdownProfile';

export default defineMessages({
  goToProfile: {
    id: `${scope}.goToProfile`,
    defaultMessage: 'Your profile',
  },
  goToDashboard: {
    id: `${scope}.goToDashboard`,
    defaultMessage: 'Dashboard',
  },
  logout: {
    id: `${scope}.logout`,
    defaultMessage: 'LOG OUT',
  },
});
