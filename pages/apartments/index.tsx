import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLoader from "../../src/components/Shared/Loader/PageLoader";

const DynamicLoginPage = dynamic(
  () => import("../../src/components/Calendar/Apartments/Apartments"),
  {
    suspense: true,
  }
);

type Props = {};

const Apartments: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <title>Apartments</title>
      <DynamicLoginPage />
    </Suspense>
  );
};

export default Apartments;
