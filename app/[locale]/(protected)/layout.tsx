import { cn } from '@/lib/utils';
import { AlertModal } from '@modules/Shared/AlertModal/AlertModal';
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
        <AlertModal />
        <Navbar />
        <div
          className={cn(
            'grid grid-cols-[1fr,min(120em,calc(100%-160px)),1fr] grid-rows-[max-content] gap-x-8 py-8',
            'max-md:grid-cols-[1fr,calc(100%-64px),1fr]',
            '[&>*]:col-[2]'
          )}
        >
          {children}
        </div>
      </AlertModalProvider>
    </Suspense>
  );
}
