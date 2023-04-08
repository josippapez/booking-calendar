import { PageLoader } from '@/components/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicApartmentsCalendarPage = dynamic(
  () => import('../../src/components/Calendar/Apartments/Apartments'),
  {
    suspense: true,
  }
);

type Props = {};

const Apartments: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <title>Apartments</title>
      <DynamicApartmentsCalendarPage />
    </Suspense>
  );
};

export default Apartments;
