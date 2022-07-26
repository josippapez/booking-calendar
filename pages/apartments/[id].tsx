import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLoader from "../../src/components/Shared/Loader/PageLoader";

const DynamicCalendar = dynamic(
  () => import("../../src/components/Calendar/Calendar"),
  {
    suspense: true,
  }
);

type Props = {};

const Calendar: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <DynamicCalendar />
    </Suspense>
  );
};

export default Calendar;
