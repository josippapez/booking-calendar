import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicInvoicePage = dynamic(
  () => import('@modules/Shared/Invoice/Invoice').then(mod => mod.Invoice),
  {
    suspense: true,
    ssr: false,
  }
);

const Invoice: NextPage = () => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <title>Invoice</title>
      <DynamicInvoicePage />
    </Suspense>
  );
};

export default Invoice;
