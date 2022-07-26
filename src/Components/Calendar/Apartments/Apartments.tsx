import isEqual from 'lodash/fp/isEqual';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirestore } from 'react-redux-firebase';
import { Link, useNavigate } from 'react-router-dom';
import isMobileView from '../../../checkForMobileView';
import {
  editApartment,
  removeApartment,
  saveApartment,
} from '../../../store/firebaseActions/apartmentActions';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectApartment,
  setApartments,
} from '../../../store/reducers/apartments';
import { setEvents } from '../../../store/reducers/events';
import Images from '../../../Styles/Assets/Images/Images';

type Props = {};

const Apartments = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const firestore = useFirestore();
  const mobileView = isMobileView();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.user.user);
  const apartments = useAppSelector(state => state.apartments);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [newApartment, setNewApartment] = useState<{
    name: string;
    address: string;
    id: string;
    email: string;
    image: File | string;
  }>({
    id: '',
    name: '',
    address: '',
    email: '',
    image: '',
  });
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const getApartmentsForuser = async (id: string) => {
    const apartmentsData = await (
      await firestore.collection('apartments').doc(id).get()
    ).data();

    if (!isEqual(apartmentsData, apartments.apartments)) {
      dispatch(
        setApartments(
          apartmentsData as {
            [key: string]: {
              id: string;
              name: string;
              address: string;
              email: string;
              image: string;
            };
          }
        )
      );
    }
  };

  useEffect(() => {
    getApartmentsForuser(user.id);
  }, []);

  return (
    <div className='flex flex-col gap-10'>
      <div>
        <div className='flex justify-between'>
          <div className='font-bold text-xl'>{t('apartments')}</div>
        </div>
        <div
          className={`flex ${
            mobileView ? 'flex-col' : 'gap-10'
          } drop-shadow-sm`}
        >
          <div
            className={`w-full ${mobileView ? '100%' : 'max-w-sm'}
            pt-6 pb-8`}
          >
            <form className='rounded-md relative'>
              {newApartment.id && (
                <div
                  className={`absolute right-0 top-0 w-8 h-8 font-black text-3xl rounded-full cursor-pointer text-center bg-white`}
                  style={{
                    backgroundImage: `url(${Images.XCircle})`,
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
                    });
                  }}
                />
              )}
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold'
                  htmlFor='apartmentName'
                >
                  {t('apartment_name')}
                </label>
                <input
                  className='appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500'
                  id='apartmentName'
                  type='text'
                  placeholder='Apartment Name'
                  value={newApartment.name}
                  onChange={e => {
                    setNewApartment({ ...newApartment, name: e.target.value });
                  }}
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold'
                  htmlFor='apartmentAddress'
                >
                  {t('apartment_address')}
                </label>
                <input
                  className='appearance-none border rounded-md w-full text-gray-700 mb-3 leading-tight focus:border-blue-500'
                  id='apartmentAddress'
                  type='text'
                  placeholder='Apartment Address'
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
                  className='block text-gray-700 text-sm font-bold'
                  htmlFor='appartmentEmail'
                >
                  {t('apartment_email')}
                </label>
                <input
                  className={`appearance-none border rounded-md w-full text-gray-700 mb-3 leading-tight focus:border-blue-500 ${
                    newApartment.email
                      ? emailRegex.test(newApartment.email)
                        ? '!border-green-500'
                        : '!border-red-500'
                      : ''
                  }`}
                  id='appartmentEmail'
                  type='text'
                  placeholder='Apartment Email'
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
                  className='bg-blue-500 hover:bg-blue-700 text-white shadow-md font-bold py-2 px-4 rounded disabled:bg-gray-400'
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
          <div className='w-full max-w-md max-h-[23rem] pt-6 pb-8'>
            {progress ? (
              <div className='flex justify-center bg-gray-200 rounded-md shadow-md w-full'>
                <div
                  className='bg-blue-500 rounded-md shadow-md'
                  style={{
                    width: `${progress}%`,
                    height: '2px',
                  }}
                />
              </div>
            ) : (
              <div className='flex flex-col h-full justify-between'>
                {newApartment.image && newApartment.image !== '' && (
                  <div className='flex justify-center'>
                    <img
                      src={
                        typeof newApartment.image === 'string'
                          ? newApartment.image
                          : URL.createObjectURL(newApartment.image)
                      }
                      alt='apartment'
                      className='h-64 w-full object-contain'
                    />
                  </div>
                )}
                <div className='flex justify-between'>
                  <div>
                    {error && (
                      <div className='text-red-500 font-bold'>{error}</div>
                    )}
                    <label
                      className='block cursor-pointer h-10 py-2 px-4 text-gray-700 font-bold w-fit rounded-md hover:bg-blue-500 hover:drop-shadow-md hover:text-white'
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
                        className='bg-blue-500 hover:bg-blue-700 text-white shadow-md font-bold py-2 px-4 rounded'
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
      <div className='relative overflow-x-auto drop-shadow-md rounded-lg'>
        <table className='w-full text-left text-gray-500 dark:text-gray-400 text-base'>
          <thead className='text-xs text-gray-700 uppercase dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3 text-md'>
                {t('name')}
              </th>
              <th scope='col' className='px-6 py-3 text-md'>
                {t('address')}
              </th>
              <th scope='col' className='px-6 py-3 text-md'>
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
                  className='bg-white border-b cursor-pointer hover:bg-blue-50 hover:transition-colors duration-150 first:rounded-t-lg'
                  key={apartments.apartments[apartment].id}
                  onClick={() => {
                    if (
                      apartments.selectedApartment?.id !==
                      apartments.apartments[apartment].id
                    ) {
                      dispatch(setEvents({}));
                    }
                    dispatch(selectApartment(apartments.apartments[apartment]));
                    navigate(
                      `/apartments/${apartments.apartments[apartment].id}`
                    );
                  }}
                >
                  <th
                    scope='row'
                    className='font-bold px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap'
                  >
                    {apartments.apartments[apartment].name}
                  </th>
                  <td className='font-bold px-6 py-4'>
                    {apartments.apartments[apartment].address}
                  </td>
                  <td className='font-bold px-6 py-4'>
                    {apartments.apartments[apartment].email}
                  </td>
                  <td
                    className={`px-6 py-4 text-right ${
                      mobileView ? 'flex' : ''
                    }`}
                  >
                    <button
                      className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                      onClick={e => {
                        e.stopPropagation();
                        dispatch(
                          removeApartment(apartments.apartments[apartment].id)
                        );
                      }}
                    >
                      {t('remove')}
                    </button>
                    <button
                      className='font-medium text-blue-600 dark:text-blue-500 hover:underline ml-4'
                      onClick={e => {
                        e.stopPropagation();
                        setNewApartment(apartments.apartments[apartment]);
                      }}
                    >
                      {t('edit')}
                    </button>
                    {!mobileView && (
                      <Link
                        key={apartments.apartments[apartment].id}
                        to={`/apartments/${apartments.apartments[apartment].id}`}
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline ml-4'
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
    </div>
  );
};

export default Apartments;
