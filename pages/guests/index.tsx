import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicGuestsPage = dynamic(
  () => import('@modules/Guests/Guests').then(mod => mod.Guests),
  {
    suspense: true,
  }
);

const Guests: NextPage = () => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <title>Guests</title>
      <DynamicGuestsPage />
    </Suspense>
  );
};

export default Guests;
