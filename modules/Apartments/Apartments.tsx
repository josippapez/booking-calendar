'use client';

import {
  SingleApartmentDto,
  useApartmentsControllerFindAllSuspense,
  useApartmentsControllerRemove,
} from '@/api';
import { Button } from '@/components/Button';
import { ApartmentsInput } from '@modules/Apartments/ApartmentsInput';
import { AlertModal } from '@modules/Shared/AlertModal/AlertModal';
import { useDebouncedValue } from '@modules/Shared/Hooks/useDebouncedValue';
import { useMobileView } from '@modules/Shared/Hooks/useMobileView';
import { useAlert } from '@modules/Shared/Providers/AlertModalProvider';
import { Modify } from '@modules/Shared/utils';
import { Link, useRouter } from '@modules/translations';
import { Routes } from 'consts';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { toast } from 'react-toastify';

export type ModifiedSingleApartmentDto = Modify<
  SingleApartmentDto,
  {
    image?: Blob | string;
  }
>;

export const Apartments: FC = () => {
  const { showAlert } = useAlert();
  const t = useTranslations('Apartments');
  const mobileView = useMobileView();
  const navigate = useRouter();

  const { data: apartments, refetch: refetchApartments } =
    useApartmentsControllerFindAllSuspense({
      query: {
        queryKey: ['apartments'],
      },
    });

  const { mutate: removeApartment, isPending: removeApartmentIsPending } =
    useApartmentsControllerRemove({
      mutation: {
        mutationKey: ['apartments-remove'],
        onSuccess: data => {
          toast.success(t('apartment_removed'));
          refetchApartments();
        },
        onError: error => {
          toast.error(error.response?.data.message);
        },
      },
    });

  const [newApartment, setNewApartment] =
    useDebouncedValue<ModifiedSingleApartmentDto>({
      id: '',
      name: '',
      address: '',
      email: '',
      image: '',
      pid: '',
      iban: '',
      owner: '',
      pricePerNight: undefined,
    });

  return (
    <>
      <AlertModal />
      <div>
        <div className='flex justify-between'>
          <div className='text-3xl font-bold'>{t('apartments')}</div>
        </div>
        <ApartmentsInput
          apartment={newApartment}
          setApartment={setNewApartment}
        />
      </div>
      <div
        className={`relative overflow-x-auto rounded-lg drop-shadow-md ${
          mobileView && 'full-bleed'
        }`}
      >
        <table className='w-full text-left text-base text-gray-500 dark:text-gray-400'>
          <thead className='text-xs uppercase text-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='text-md px-6 py-3'>
                {t('name')}
              </th>
              <th scope='col' className='text-md px-6 py-3'>
                {t('address')}
              </th>
              <th scope='col' className='text-md px-6 py-3'>
                {t('email')}
              </th>
              <th scope='col' className='px-6 py-3'>
                <span className='sr-only'>{t('edit')}</span>
                <span className='sr-only'>{t('remove')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {apartments.map(apartment => (
              <tr
                className='cursor-pointer border-b bg-white duration-150 first:rounded-t-lg hover:bg-blue-50 hover:transition-colors'
                key={apartment.id}
                onClick={() => {
                  navigate.push(`${Routes.APARTMENT}?id=${apartment.id}`);
                }}
              >
                <td className='whitespace-nowrap px-6 py-4 font-bold text-gray-900 dark:text-white'>
                  {apartment.name}
                </td>
                <td className='px-6 py-4 font-bold'>{apartment.address}</td>
                <td className='px-6 py-4 font-bold'>{apartment.email}</td>
                <td
                  className={`px-6 py-4 text-right ${mobileView ? 'flex' : ''}`}
                >
                  <Button
                    size='small'
                    className='w-fit'
                    text={t('remove')}
                    variation='accent'
                    onClick={e => {
                      e.stopPropagation();
                      showAlert(t('remove_apartment'), false, () =>
                        removeApartment({
                          id: apartment.id,
                        })
                      );
                    }}
                    disabled={removeApartmentIsPending}
                  />
                  <button
                    className='ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500'
                    onClick={e => {
                      e.stopPropagation();
                      setNewApartment({
                        ...apartment,
                      });
                    }}
                  >
                    {t('edit')}
                  </button>
                  {!mobileView && (
                    <Link
                      key={apartment.id}
                      href={`${Routes.APARTMENT}?id=${apartment.id}`}
                      className='ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500'
                    >
                      {t('select')}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
