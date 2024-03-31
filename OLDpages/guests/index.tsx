import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

const DynamicGuestsPage = dynamic(
  () => import('@modules/Guests/Guests').then(mod => mod.Guests),
  {
    suspense: true,
    loading: () => <PageLoader isLoading />,
  }
);

const Guests: NextPage = () => {
  return (
    <>
      <title>Guests</title>
      <DynamicGuestsPage />
    </>
  );
};

export default Guests;
