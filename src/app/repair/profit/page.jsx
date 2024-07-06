import React, { Suspense } from 'react';
import Profit from './Profit';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profit />
    </Suspense>
  );
}
