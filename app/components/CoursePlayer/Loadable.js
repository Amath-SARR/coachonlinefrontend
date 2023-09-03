/**
 *
 * Asynchronously loads the component for CoursePlayer
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
