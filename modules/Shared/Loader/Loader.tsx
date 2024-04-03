import { cltm } from '@modules/Shared/utils';
import { FC } from 'react';

type Props = { isLoading?: boolean; inline?: boolean };

export const Loader: FC<Props> = ({ isLoading, inline }) => {
  return isLoading ? (
    <div
      className={`${
        !inline ? 'fixed' : ''
      }  bottom-0 left-0 right-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white dark:bg-neutral-700`}
    >
      <div
        className={cltm(
          'h-[200px] w-[200px] animate-spin bg-[url:"/Styles/Assets/Images/loading.svg"] bg-contain bg-no-repeat'
        )}
      />
    </div>
  ) : null;
};
