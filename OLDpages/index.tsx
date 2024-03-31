import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicLoginPage = dynamic(
  () => import('@modules/LoginPage/LoginPage').then(mod => mod.LoginPage),
  {
    suspense: true,
  }
);

const LoginPage: NextPage = () => {
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
