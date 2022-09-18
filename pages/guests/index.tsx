import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLoader from "../../src/components/Shared/Loader/PageLoader";

const DynamicGuestsPage = dynamic(
  () => import("../../src/components/Guests/Guests"),
  {
    suspense: true
  }
);

type Props = {};

const Guests: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <title>Guests</title>
      <DynamicGuestsPage />
    </Suspense>
  );
};

export default Guests;
