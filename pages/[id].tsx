import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLoader from "../src/components/Shared/Loader/PageLoader";

const DynamicPublicCalendar = dynamic(
  () => import("../src/components/Home/LandingPage/PublicCalendar"),
  {
    suspense: true,
  }
);

type Props = {};

const PublicCalendar: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <DynamicPublicCalendar />
    </Suspense>
  );
};

export default PublicCalendar;
