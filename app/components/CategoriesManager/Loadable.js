/**
 *
 * Asynchronously loads the component for CategoriesManager
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
