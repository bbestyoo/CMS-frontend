import React, { Suspense } from 'react';
import Search from './Search';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
    </Suspense>
  );
}
