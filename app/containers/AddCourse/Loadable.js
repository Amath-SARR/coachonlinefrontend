/**
 *
 * Asynchronously loads the component for AddCourse
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
