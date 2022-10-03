import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLoader from "../../src/components/Shared/Loader/PageLoader";

const DynamicInvoicePage = dynamic(
  () => import("../../src/components/Shared/Invoice/Invoice"),
  {
    suspense: true,
  }
);

type Props = {};

const Invoice: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <title>Invoice</title>
      <DynamicInvoicePage />
    </Suspense>
  );
};

export default Invoice;
