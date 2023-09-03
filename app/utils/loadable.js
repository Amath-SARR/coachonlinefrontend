import React, { lazy, Suspense } from 'react';
import ScreenLoader from '../components/ScreenLoader';

function retry(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            window.location.reload(true);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

const loadable = (importFunc, { fallback = null } = { fallback: null }) => {
  const LazyComponent = lazy(() => retry(importFunc));

  return (props) => (
    <Suspense fallback={fallback || <ScreenLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default loadable;
