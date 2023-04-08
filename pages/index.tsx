import { PageLoader } from '@/components/Shared/Loader/PageLoader';
import { GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicLoginPage = dynamic(
  () => import('../src/components/LoginPage/LoginPage'),
  {
    suspense: true,
  }
);

type Props = {};

const LoginPage: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader isLoading />}>
      <title>Login</title>
      <DynamicLoginPage />
    </Suspense>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  return {
    props: {},
  };
};

export default LoginPage;
