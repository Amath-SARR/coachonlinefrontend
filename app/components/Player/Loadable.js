/**
 *
 * Asynchronously loads the component for Player
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
