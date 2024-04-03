import { Navbar } from '@modules/Shared/Navbar/Navbar';
import { AlertModalProvider } from '@modules/Shared/Providers/AlertModalProvider';
import { ReactNode, Suspense } from 'react';

type Props = {
  children: ReactNode;
};

export default async function RootProtectedLayout({ children }: Props) {
  return (
    <Suspense>
      <AlertModalProvider>
        <Navbar />
        {children}
      </AlertModalProvider>
    </Suspense>
  );
}
