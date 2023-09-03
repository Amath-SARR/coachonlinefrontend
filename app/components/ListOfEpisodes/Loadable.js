/**
 *
 * Asynchronously loads the component for ListOfEpisodes
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
