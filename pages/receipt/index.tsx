import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLoader from "../../src/components/Shared/Loader/PageLoader";

const DynamicReceiptPage = dynamic(
  () => import("../../src/components/Shared/Receipt/Receipt"),
  {
    suspense: true,
    ssr: false,
  }
);

type Props = {};

const Receipt: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <title>Receipt</title>
      <DynamicReceiptPage />
    </Suspense>
  );
};

export default Receipt;
