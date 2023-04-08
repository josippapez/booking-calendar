import { PageLoader } from '@/components/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicInvoicePage = dynamic(
  () => import('@/components/Shared/Invoice/Invoice'),
  {
    suspense: true,
    ssr: false,
  }
);

type Props = {};

const Invoice: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <title>Invoice</title>
      <DynamicInvoicePage />
    </Suspense>
  );
};

export default Invoice;
