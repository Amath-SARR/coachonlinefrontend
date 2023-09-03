/**
 *
 * Asynchronously loads the component for OfficeNavigator
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
