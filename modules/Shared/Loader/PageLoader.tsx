import { Loader } from '@modules/Shared/Loader/Loader';
import React from 'react';

interface Props {
  children?: React.ReactNode;
  isLoading?: boolean;
  inline?: boolean;
}

export const PageLoader = ({ children, isLoading, inline }: Props) => {
  return (
    <>
      <Loader isLoading={isLoading} inline={inline} />
      {children}
    </>
  );
};
