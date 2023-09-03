/**
 *
 * Asynchronously loads the component for B2B
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
