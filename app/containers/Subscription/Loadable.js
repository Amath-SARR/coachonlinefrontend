/**
 *
 * Asynchronously loads the component for Subscription
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
