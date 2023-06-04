import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const DynamicInvoicePage = dynamic(
  () => import('@modules/Invoice/Invoice').then(mod => mod.Invoice),
  {
    suspense: true,
    loading: () => <PageLoader isLoading />,
  }
);

const InvoicePage: NextPage = () => {
  return (
    <>
      <title>Invoice</title>
      <DynamicInvoicePage />
    </>
  );
};

export default InvoicePage;
