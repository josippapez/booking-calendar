import { Invoice } from '@modules/Invoice';
import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import { Suspense } from 'react';

const InvoicePage: NextPage = () => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <title>Invoice</title>
      <Invoice />
    </Suspense>
  );
};

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default InvoicePage;
