/**
 *
 * Asynchronously loads the component for Stripe
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
