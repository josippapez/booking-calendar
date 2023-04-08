import { PageLoader } from '@/components/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicGuestsPage = dynamic(
  () => import('../../src/components/Guests/Guests'),
  {
    suspense: true,
  }
);

type Props = {};

const Guests: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <title>Guests</title>
      <DynamicGuestsPage />
    </Suspense>
  );
};

export default Guests;
