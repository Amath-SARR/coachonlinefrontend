/**
 *
 * Asynchronously loads the component for LibraryProfilePage
 */

import React from 'react';
import loadable from '../../../utils/loadable';

export default loadable(() => import('./index.tsx'));
