import { SingleApartmentDto, useApartmentsControllerRemove } from '@/api';
import { Button } from '@/components/ui/button';
import { EditApartment } from '@modules/Apartments/EditApartment';
import { useAlert } from '@modules/Shared/Providers/AlertModalProvider';
import { queryClient } from '@modules/Shared/Providers/TanstackQueryProvider';
import { useRouter } from '@modules/translations';
import { createColumnHelper } from '@tanstack/react-table';
import { Routes } from 'consts';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

const columnHelper = createColumnHelper<SingleApartmentDto>();

const Header: React.FC<{
  translationKey: string;
}> = ({ translationKey }) => {
  const t = useTranslations('Apartments');
  return <span>{t(translationKey as any)}</span>;
};

const Actions: React.FC<{ apartment: SingleApartmentDto }> = ({
  apartment,
}) => {
  const t = useTranslations('Apartments');
  const { showAlert } = useAlert();
  const navigate = useRouter();

  const { mutate: removeApartment, isPending: removeApartmentIsPending } =
    useApartmentsControllerRemove({
      mutation: {
        mutationKey: ['apartments-remove'],
        onSuccess: data => {
          toast.success(t('apartment_removed'));
          queryClient.refetchQueries({
            queryKey: ['apartments'],
          });
        },
        onError: error => {
          toast.error(error.response?.data.message);
        },
      },
    });

  return (
    <div className='flex items-center gap-4'>
      <Button
        variant='destructive'
        size={'sm'}
        className='w-fit'
        onClick={e => {
          showAlert(t('remove_apartment'), false, () =>
            removeApartment({
              apartmentId: apartment.id,
            })
          );
        }}
        disabled={removeApartmentIsPending}
        leftIcon={
          removeApartmentIsPending ? (
            <Loader2Icon className='animate-spin' />
          ) : null
        }
      >
        {t('remove')}
      </Button>
      <EditApartment apartment={apartment} />
      <Button
        variant='link'
        className='w-fit'
        onClick={() => navigate.push(`${Routes.APARTMENT}/${apartment.id}`)}
      >
        {t('select')}
      </Button>
    </div>
  );
};

export const apartmentsColumns: any = [
  columnHelper.accessor(row => row.name, {
    id: 'name',
    cell: info => <span className='font-bold'>{info.getValue()}</span>,
    header: () => <Header translationKey={'name'} />,
  }),
  columnHelper.accessor(row => row.address, {
    id: 'address',
    cell: info => info.getValue(),
    header: () => <Header translationKey={'address'} />,
  }),
  columnHelper.accessor(row => row.email, {
    id: 'email',
    cell: info => info.getValue(),
    header: () => <Header translationKey={'email'} />,
  }),
  columnHelper.accessor(row => row, {
    id: 'actions',
    cell: info => <Actions apartment={info.getValue()} />,
    header: () => null,
    size: 300,
  }),
];
