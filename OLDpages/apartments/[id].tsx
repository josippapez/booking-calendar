import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicCalendar = dynamic(
  () => import('@modules/Calendar/Calendar').then(mod => mod.Calendar),
  {
    suspense: true,
  }
);

const Calendar: NextPage = () => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <DynamicCalendar />
    </Suspense>
  );
};

export default Calendar;
