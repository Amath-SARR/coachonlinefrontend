/**
 *
 * Asynchronously loads the component for StudentProfilePage
 *
 */

import React from 'react';
import loadable from '../../../utils/loadable';

export default loadable(() => import('./index'));
