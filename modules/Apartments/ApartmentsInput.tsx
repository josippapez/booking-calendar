import {
  editApartment,
  saveApartment,
} from '@/store/firebaseActions/apartmentActions';
import { useAppDispatch } from '@/store/hooks';
import { ApartmentsImageInput } from '@modules/Apartments/ApartmentsImageInput';
import { Apartment } from '@modules/Apartments/models/Apartment';
import { useMobileView } from '@modules/Shared/Hooks/useMobileView';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  apartment: Apartment;
  setApartment: (value: Apartment) => void;
};

export const ApartmentsInput: FC<Props> = ({
  apartment: newApartment,
  setApartment: setNewApartment,
}) => {
  const { t } = useTranslation('Apartments');
  const dispatch = useAppDispatch();
  const mobileView = useMobileView();

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<null | string>(null);

  const emailRegex = useMemo(
    () =>
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    []
  );

  const resetApartment = useCallback(
    () =>
      setNewApartment({
        id: '',
        name: '',
        address: '',
        email: '',
        image: '',
        pid: '',
        iban: '',
        owner: '',
      }),
    [setNewApartment]
  );

  const handleSaveApartment = useCallback(() => {
    if (
      newApartment.address &&
      newApartment.name &&
      emailRegex.test(newApartment.email)
    ) {
      if (newApartment.id) {
        dispatch(editApartment(newApartment, setProgress, setError)).then(
          resetApartment,
          resetApartment
        );
        return;
      }
      dispatch(
        saveApartment(
          {
            ...newApartment,
            id: crypto.getRandomValues(new Uint8Array(16)).join(''),
          },
          setProgress,
          setError
        )
      ).then(resetApartment, resetApartment);
    }
  }, [dispatch, emailRegex, newApartment, resetApartment]);

  return (
    <div
      className={`flex ${mobileView ? 'flex-col' : 'gap-10'} drop-shadow-sm`}
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
                  pricePerNight: undefined,
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
              defaultValue={newApartment.name}
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
              defaultValue={newApartment.address}
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
              defaultValue={newApartment.owner}
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
              defaultValue={newApartment.pid}
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
              defaultValue={newApartment.iban}
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
              defaultValue={newApartment.email}
              onChange={e => {
                setNewApartment({
                  ...newApartment,
                  email: e.target.value,
                });
              }}
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-sm font-bold text-gray-700'
              htmlFor='apartmentPricePerNight'
            >
              {t('apartment_price_per_night')}
            </label>
            <input
              className='w-full appearance-none rounded-md border leading-tight text-gray-700 focus:border-blue-500'
              id='apartmentPricePerNight'
              type='number'
              defaultValue={newApartment.pricePerNight}
              onChange={e => {
                setNewApartment({
                  ...newApartment,
                  pricePerNight: e.target.valueAsNumber,
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
              onClick={handleSaveApartment}
            >
              {newApartment?.id ? t('edit_apartment') : t('add_apartment')}
            </button>
          </div>
        </form>
      </div>
      <ApartmentsImageInput
        apartment={newApartment}
        error={error}
        progress={progress}
        setApartment={setNewApartment}
        setError={setError}
      />
    </div>
  );
};
