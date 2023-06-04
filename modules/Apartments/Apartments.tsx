import {
  getApartmentsForUser,
  removeApartment,
} from '@/store/firebaseActions/apartmentActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectApartment, setApartments } from '@/store/reducers/apartments';
import { setEvents } from '@/store/reducers/events';
import { ApartmentsInput } from '@modules/Apartments/ApartmentsInput';
import { Apartment } from '@modules/Apartments/models/Apartment';
import { AlertModal } from '@modules/Shared/AlertModal/AlertModal';
import { useDebouncedValue } from '@modules/Shared/Hooks/useDebouncedValue';
import { useMobileView } from '@modules/Shared/Hooks/useMobileView';
import { useAlert } from '@modules/Shared/Providers/AlertModalProvider';
import { Routes } from 'consts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Apartments: FC = () => {
  const { showAlert } = useAlert();
  const { t } = useTranslation('Apartments');
  const dispatch = useAppDispatch();
  const mobileView = useMobileView();
  const navigate = useRouter();
  const apartments = useAppSelector(state => state.apartments);

  const [newApartment, setNewApartment] = useDebouncedValue<Apartment>({
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

  useEffect(() => {
    dispatch(getApartmentsForUser()).then(data => {
      if (data) {
        setApartments(data);
      }
    });
  }, []);

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
            {apartments?.apartments &&
              Object.keys(apartments.apartments).map(apartment => (
                <tr
                  className='cursor-pointer border-b bg-white duration-150 first:rounded-t-lg hover:bg-blue-50 hover:transition-colors'
                  key={apartments.apartments[apartment].id}
                  onClick={() => {
                    if (
                      apartments.selectedApartment?.id !==
                      apartments.apartments[apartment].id
                    ) {
                      dispatch(setEvents({}));
                    }
                    dispatch(selectApartment(apartments.apartments[apartment]));
                    navigate.push({
                      pathname: Routes.APARTMENT,
                      query: {
                        id: apartments.apartments[apartment].id,
                      },
                    });
                  }}
                >
                  <td className='whitespace-nowrap px-6 py-4 font-bold text-gray-900 dark:text-white'>
                    {apartments.apartments[apartment].name}
                  </td>
                  <td className='px-6 py-4 font-bold'>
                    {apartments.apartments[apartment].address}
                  </td>
                  <td className='px-6 py-4 font-bold'>
                    {apartments.apartments[apartment].email}
                  </td>
                  <td
                    className={`px-6 py-4 text-right ${
                      mobileView ? 'flex' : ''
                    }`}
                  >
                    <button
                      className='font-medium text-blue-600 hover:underline dark:text-blue-500'
                      onClick={e => {
                        e.stopPropagation();
                        showAlert(t('remove_apartment'), false, () =>
                          dispatch(
                            removeApartment(apartments.apartments[apartment].id)
                          )
                        );
                      }}
                    >
                      {t('remove')}
                    </button>
                    <button
                      className='ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      onClick={e => {
                        e.stopPropagation();
                        setNewApartment({
                          ...apartments.apartments[apartment],
                        });
                      }}
                    >
                      {t('edit')}
                    </button>
                    {!mobileView && (
                      <Link
                        key={apartments.apartments[apartment].id}
                        href={`/apartments/${apartments.apartments[apartment].id}`}
                        className='ml-4 font-medium text-blue-600 hover:underline dark:text-blue-500'
                        onClick={() => {
                          if (
                            apartments.selectedApartment?.id !==
                            apartments.apartments[apartment].id
                          ) {
                            dispatch(setEvents({}));
                          }
                          dispatch(
                            selectApartment(apartments.apartments[apartment])
                          );
                        }}
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
