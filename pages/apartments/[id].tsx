import { PageLoader } from '@/components/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicCalendar = dynamic(
  () => import('../../src/components/Calendar/Calendar'),
  {
    suspense: true,
  }
);

type Props = {};

const Calendar: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <DynamicCalendar {...props} />
    </Suspense>
  );
};

export default Calendar;
