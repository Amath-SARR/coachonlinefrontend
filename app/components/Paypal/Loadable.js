/**
 *
 * Asynchronously loads the component for Paypal
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
