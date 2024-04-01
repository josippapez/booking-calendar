'use client';

import { ErrorType } from '@/api';
import { Button } from '@/components/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: { digest?: string } & ErrorType<Error>;
  reset: () => void;
}) {
  const errorCode = error?.response?.status;

  const Notfound = errorCode === 404;

  return (
    <div className='grid gap-5'>
      <h3 className='typo-heading-h3 text-error font-bold'>
        Something went wrong.{' '}
        {Notfound ? 'This item does not exist' : ''}. Please try
        again.
      </h3>

      <p>
        {error?.response?.statusText} - {error?.response?.data?.message}
      </p>
      <Button
        variation='primary'
        size='small'
        className='w-fit'
        onClick={() => {
          reset();
        }}
        text='Try again'
      />
    </div>
  );
}
