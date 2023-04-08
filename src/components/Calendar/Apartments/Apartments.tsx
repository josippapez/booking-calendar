import { useAlert } from '@/AlertModalProvider';
import { useMobileView } from '@/checkForMobileView';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  editApartment,
  getApartmentsForuser,
  removeApartment,
  saveApartment,
} from 'store/firebaseActions/apartmentActions';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectApartment, setApartments } from 'store/reducers/apartments';
import { setEvents } from 'store/reducers/events';

const Apartments: FC = () => {
  const { showAlert } = useAlert();
  const { t } = useTranslation('Apartments');
  const dispatch = useAppDispatch();
  const mobileView = useMobileView();
  const navigate = useRouter();
  const apartments = useAppSelector(state => state.apartments);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [newApartment, setNewApartment] = useState<{
    name: string;
    address: string;
    id: string;
    email: string;
    image: File | string;
    pid: string;
    iban: string;
    owner: string;
  }>({
    id: '',
    name: '',
    address: '',
    email: '',
    image: '',
    pid: '',
    iban: '',
    owner: '',
  });
  const emailRegex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  useEffect(() => {
    dispatch(getApartmentsForuser()).then(data => {
      if (data) {
        setApartments(data);
      }
    });
  }, []);

  return (
    <>
      <div>
        <div className='flex justify-between'>
          <div className='text-3xl font-bold'>{t('apartments')}</div>
        </div>
        <div
          className={`flex ${
            mobileView ? 'flex-col' : 'gap-10'
          } drop-shadow-sm`}
        >
          <div
            className={`w-full ${mobileView ? '100%' : 'max-w-sm'}
            mb-8 mt-6`}
          >
            <form className='relative rounded-md'>
              {newApartment.id && (
                <div
                  className={`absolute -top-4 right-0 h-8 w-8 cursor-pointer rounded-full bg-transparent text-center text-3xl font-black`}
                  style={{
                    backgroundImage: `url(/Styles/Assets/Images/xCircle.svg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                  }}
                  onClick={() => {
                    setNewApartment({
                      id: '',
                      name: '',
                      address: '',
                      email: '',
                      image: '',
                      pid: '',
                      iban: '',
                      owner: '',
                    });
                  }}
                />
              )}
              <div className='mb-4'>
                <label
                  className='block text-sm font-bold text-gray-700'
                  htmlFor='apartmentName'
                >
                  {t('apartment_name')}
                </label>
                <input
                  className='w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
                  id='apartmentName'
                  type='text'
                  value={newApartment.name}
                  onChange={e => {
                    setNewApartment({ ...newApartment, name: e.target.value });
                  }}
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-sm font-bold text-gray-700'
                  htmlFor='apartmentAddress'
                >
                  {t('apartment_address')}
                </label>
                <input
                  className='w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
                  id='apartmentAddress'
                  type='text'
                  value={newApartment.address}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      address: e.target.value,
                    });
                  }}
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-sm font-bold text-gray-700'
                  htmlFor='apartmentOwner'
                >
                  {t('apartment_owner')}
                </label>
                <input
                  className='w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
                  id='apartmentOwner'
                  type='text'
                  value={newApartment.owner}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      owner: e.target.value,
                    });
                  }}
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-sm font-bold text-gray-700'
                  htmlFor='apartmentPID'
                >
                  {t('apartment_pid')}
                </label>
                <input
                  className='w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
                  id='apartmentPID'
                  type='text'
                  value={newApartment.pid}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      pid: e.target.value,
                    });
                  }}
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-sm font-bold text-gray-700'
                  htmlFor='apartmentIBAN'
                >
                  {t('apartment_IBAN')}
                </label>
                <input
                  className='w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
                  id='apartmentIBAN'
                  type='text'
                  value={newApartment.iban}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      iban: e.target.value,
                    });
                  }}
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-sm font-bold text-gray-700'
                  htmlFor='appartmentEmail'
                >
                  {t('apartment_email')}
                </label>
                <input
                  className={`mb-3 w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500  ${
                    newApartment.email
                      ? emailRegex.test(newApartment.email)
                        ? '!border-green-500'
                        : '!border-red-500'
                      : ''
                  }`}
                  id='appartmentEmail'
                  type='text'
                  value={newApartment.email}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
              <div className='flex items-center justify-between'>
                <button
                  disabled={
                    !newApartment.address ||
                    !newApartment.name ||
                    !emailRegex.test(newApartment.email)
                  }
                  className='rounded bg-blue-700 px-4 py-2 font-bold text-white shadow-md hover:bg-blue-500 disabled:bg-gray-400'
                  type='button'
                  onClick={() => {
                    if (
                      newApartment.address &&
                      newApartment.name &&
                      emailRegex.test(newApartment.email)
                    ) {
                      if (newApartment.id) {
                        dispatch(
                          editApartment(newApartment, setProgress, setError)
                        );
                        setNewApartment({
                          id: '',
                          name: '',
                          address: '',
                          email: '',
                          image: '',
                          pid: '',
                          iban: '',
                          owner: '',
                        });
                        return;
                      }
                      dispatch(
                        saveApartment(
                          {
                            ...newApartment,
                            id: crypto
                              .getRandomValues(new Uint8Array(16))
                              .join(''),
                          },
                          setProgress,
                          setError
                        )
                      );
                      setNewApartment({
                        id: '',
                        name: '',
                        address: '',
                        email: '',
                        image: '',
                        pid: '',
                        iban: '',
                        owner: '',
                      });
                    }
                  }}
                >
                  {newApartment && newApartment.id
                    ? t('edit_apartment')
                    : t('add_apartment')}
                </button>
              </div>
            </form>
          </div>
          <div className={`mb-8 mt-6 w-full max-w-md`}>
            {progress ? (
              <div className='flex w-full justify-center rounded-md bg-gray-200 shadow-md'>
                <div
                  className='rounded-md bg-blue-500 shadow-md'
                  style={{
                    width: `${progress}%`,
                    height: '2px',
                  }}
                />
              </div>
            ) : (
              <div className='flex h-full flex-col justify-between gap-4'>
                {newApartment.image && newApartment.image !== '' && (
                  <div
                    className={`relative flex justify-center ${
                      mobileView ? 'h-[17rem]' : 'h-full'
                    }`}
                  >
                    <Image
                      src={
                        typeof newApartment.image === 'string'
                          ? newApartment.image
                          : URL.createObjectURL(newApartment.image)
                      }
                      objectFit='contain'
                      alt='apartment Logo'
                      layout='fill'
                      placeholder='empty'
                    />
                  </div>
                )}
                <div className='flex justify-between'>
                  <div>
                    {error && (
                      <div className='font-bold text-red-500'>{error}</div>
                    )}
                    <label
                      className='block h-10 w-fit cursor-pointer rounded-md px-4 py-2 font-bold text-gray-700 hover:bg-blue-500 hover:text-white hover:drop-shadow-md'
                      htmlFor='apartmentImage'
                    >
                      {t('apartment_image')}
                    </label>
                    <input
                      className='hidden'
                      id='apartmentImage'
                      type='file'
                      accept='image/png, image/jpeg, image/jpg'
                      onClick={e => {
                        setError(null);
                      }}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          if (
                            parseInt(
                              (e.target.files[0].size / (1024 * 1024)).toFixed(
                                2
                              )
                            ) < 2
                          ) {
                            setNewApartment({
                              ...newApartment,
                              image: e.target.files[0],
                            });
                          } else {
                            setError(t('image_size_error', { size: 2 }));
                          }
                        }
                      }}
                    />
                  </div>
                  {newApartment.image && newApartment.image !== '' && (
                    <div>
                      <button
                        className='rounded bg-blue-700 px-4 py-2 font-bold text-white shadow-md hover:bg-blue-500'
                        type='button'
                        onClick={() => {
                          setNewApartment({
                            ...newApartment,
                            image: '',
                          });
                        }}
                      >
                        {t('clear')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
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
            {apartments &&
              apartments?.apartments &&
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
                    navigate.push(
                      `/apartments/${apartments.apartments[apartment].id}`
                    );
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
                        showAlert(
                          t('remove_apartment'),
                          false,
                          () => () =>
                            dispatch(
                              removeApartment(
                                apartments.apartments[apartment].id
                              )
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
                          pid: apartments.apartments[apartment]?.pid || '',
                          iban: apartments.apartments[apartment]?.iban || '',
                          owner: apartments.apartments[apartment]?.owner || '',
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

export default Apartments;
