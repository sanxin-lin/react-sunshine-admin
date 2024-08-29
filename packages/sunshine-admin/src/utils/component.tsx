import React from 'react';

export const createAysncComponent = (importFn: any) => {
  const Component = React.lazy(importFn);
  return (
    <React.Suspense>
      <Component />
    </React.Suspense>
  );
};
