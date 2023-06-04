import { Apartment } from '@modules/Apartments/models/Apartment';
import { useMobileView } from '@modules/Shared/Hooks/useMobileView';
import Image from 'next/image';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  progress: number;
  apartment: Apartment;
  setApartment: (apartment: Apartment) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

export const ApartmentsImageInput: FC<Props> = ({
  error,
  setError,
  setApartment,
  apartment,
  progress,
}) => {
  const { t } = useTranslation('Apartments');
  const mobileView = useMobileView();

  return (
    <div className={`mb-8 mt-6 w-full`}>
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
          {apartment.image && apartment.image !== '' && (
            <div
              className={`relative flex justify-center ${
                mobileView ? 'h-[17rem]' : 'h-full'
              }`}
            >
              <Image
                src={
                  typeof apartment.image === 'string'
                    ? apartment.image
                    : URL.createObjectURL(apartment.image)
                }
                alt='apartment Logo'
                placeholder='empty'
                width={mobileView ? 300 : 700}
                height={mobileView ? 300 : 500}
              />
            </div>
          )}
          <div className='flex justify-between'>
            <div>
              {error && <div className='font-bold text-red-500'>{error}</div>}
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
                  if (e.target.files?.[0]) {
                    if (
                      parseInt(
                        (e.target.files[0].size / (1024 * 1024)).toFixed(2)
                      ) < 2
                    ) {
                      setApartment({
                        ...apartment,
                        image: e.target.files[0],
                      });
                    } else {
                      setError(t('image_size_error', { size: 2 }));
                    }
                  }
                }}
              />
            </div>
            {apartment.image && apartment.image !== '' && (
              <div>
                <button
                  className='rounded bg-blue-700 px-4 py-2 font-bold text-white shadow-md hover:bg-blue-500'
                  type='button'
                  onClick={() => {
                    setApartment({
                      ...apartment,
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
  );
};
