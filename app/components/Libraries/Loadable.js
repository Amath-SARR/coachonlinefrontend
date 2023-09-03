/**
 *
 * Asynchronously loads the component for Libraries
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
