import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicApartmentsCalendarPage = dynamic(
  () => import('@modules/Apartments/Apartments').then(mod => mod.Apartments),
  {
    suspense: true,
  }
);

const Apartments: NextPage = () => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <title>Apartments</title>
      <DynamicApartmentsCalendarPage />
    </Suspense>
  );
};

export default Apartments;
