import { GetStaticProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLoader from "../src/components/Shared/Loader/PageLoader";

const DynamicLoginPage = dynamic(
  () => import("../src/components/LoginPage/LoginPage"),
  {
    suspense: true,
  }
);

type Props = {};

const LoginPage: NextPage = (props: Props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <title>Login</title>
      <DynamicLoginPage />
    </Suspense>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};

export default LoginPage;
