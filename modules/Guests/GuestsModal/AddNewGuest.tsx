import {
  deleteGuestForApartment,
  saveGuestForApartment,
} from '@/store/firebaseActions/guestsActions';
import { useAppDispatch } from '@/store/hooks';
import { AlertModal } from '@modules/Shared';
import { DatePicker } from '@modules/Shared/DatePicker';
import { Modal } from '@modules/Shared/Modal/Modal';
import { useAlert } from '@modules/Shared/Providers/AlertModalProvider';
import { DateTime } from 'luxon';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  show: boolean;
  selectedGuest?: Guest;
  selectedGuestId?: string;
  closeModal: () => void;
};

export type Guest = {
  name: string;
  PID: string;
  travelIdNumber: string;
  dateOfBirth: string;
  dateOfArrival: string;
  dateOfDeparture: string;
  country: string;
  city: string;
  address: string;
  numberOfInvoice?: string;
  note: string;
};

export const AddNewGuest: FC<Props> = ({
  show,
  closeModal,
  selectedGuest,
  selectedGuestId,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation('AddNewGuest');
  const dispatch = useAppDispatch();
  const [guestInfo, setGuestInfo] = useState<Guest>(
    selectedGuest || {
      name: '',
      PID: '',
      dateOfBirth: '',
      dateOfArrival: '',
      dateOfDeparture: '',
      country: '',
      city: '',
      address: '',
      numberOfInvoice: '',
      travelIdNumber: '',
      note: '',
    }
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<string>('');

  const requiredFileds = [
    'name',
    'PID',
    'dateOfBirth',
    'dateOfArrival',
    'dateOfDeparture',
  ];

  const checkForRequiredFields = () => {
    const errors: string[] = [];
    requiredFileds.forEach((field: string) => {
      if (!guestInfo[field as keyof Guest]) {
        errors.push(field);
      }
    });
    setErrors(errors);
    return errors.length === 0;
  };

  const sortedInputs = [
    'name',
    'PID',
    'dateOfBirth',
    'dateOfArrival',
    'dateOfDeparture',
    'country',
    'city',
    'address',
    'numberOfInvoice',
    'travelIdNumber',
    'note',
  ];

  return (
    <Modal
      show={show}
      closeModal={closeModal}
      width='min(100%, 500px)'
      animation='fade'
    >
      <div className='rounded-md bg-white shadow-md'>
        <h1 className='rounded-t-md bg-gray-200 px-10 py-4 text-center font-semibold'>
          {t('title')}
        </h1>
        <div className='p-5'>
          <div className='flex flex-col gap-2'>
            {sortedInputs.map((key: string) => {
              return (
                <div key={key} className='flex flex-col'>
                  <label htmlFor={key} className='font-semibold'>
                    {t(key)}
                  </label>
                  {key.includes('dateOf') ? (
                    <>
                      <input
                        type='button'
                        name={key}
                        id={key}
                        className={`rounded-md border bg-white focus:border-blue-500 ${
                          errors.includes(key) ? 'border-red-500' : ''
                        }`}
                        value={
                          guestInfo[key as keyof Guest]
                            ? DateTime.fromISO(
                                guestInfo[
                                  key as keyof {
                                    dateOfArrival: string;
                                    dateOfDeparture: string;
                                  }
                                ]
                              ).toLocaleString({
                                month: 'long',
                                day: '2-digit',
                                year: 'numeric',
                              })
                            : guestInfo[key as keyof Guest]
                        }
                        onClick={() => setShowDatePicker(key)}
                      />
                      <DatePicker
                        type='date'
                        hideOnlyYearButton
                        closeDatePicker={() => setShowDatePicker('')}
                        showDatePicker={showDatePicker === key ? true : false}
                        initialDate={guestInfo[key as keyof Guest]}
                        setDate={(date: string) => {
                          setErrors(prev => {
                            return prev.filter(error => error !== key);
                          });
                          setGuestInfo({
                            ...guestInfo,
                            [key as keyof Guest]: date,
                          });
                        }}
                        resetData={() => {
                          setGuestInfo({
                            ...guestInfo,
                            [key as keyof Guest]: '',
                          });
                        }}
                      />
                    </>
                  ) : (
                    <input
                      type='text'
                      name={key}
                      id={key}
                      className={`rounded-md border bg-white focus:border-blue-500 ${
                        errors.includes(key) ? 'border-red-500' : ''
                      }`}
                      value={guestInfo[key as keyof Guest]}
                      onChange={e => {
                        setErrors(prev => {
                          return prev.filter(error => error !== key);
                        });
                        setGuestInfo({
                          ...guestInfo,
                          [key]: e.target.value,
                        });
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className='flex justify-between p-5'>
          <button
            className='rounded-md bg-blue-700 p-2 font-bold text-white hover:bg-blue-500'
            onClick={closeModal}
          >
            {t('cancel')}
          </button>
          {selectedGuest && selectedGuestId && (
            <button
              className='rounded-md bg-red-700 p-2 font-bold text-white hover:bg-red-500'
              onClick={async () => {
                showAlert(t('remove_guest'), false, () => async () => {
                  await dispatch(
                    deleteGuestForApartment(selectedGuestId, selectedGuest)
                  );
                  closeModal();
                });
              }}
            >
              {t('delete')}
            </button>
          )}
          <button
            className='rounded-md bg-blue-700 p-2 font-bold text-white hover:bg-blue-500'
            onClick={async () => {
              if (checkForRequiredFields()) {
                if (selectedGuest && selectedGuestId) {
                  await dispatch(
                    deleteGuestForApartment(selectedGuestId, selectedGuest)
                  );
                }
                await dispatch(saveGuestForApartment(guestInfo));
                closeModal();
              }
            }}
          >
            {t('save')}
          </button>
        </div>
      </div>
      <AlertModal />
    </Modal>
  );
};
