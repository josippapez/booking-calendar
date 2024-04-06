import {
  GuestObject,
  SingleApartmentDto,
  useGuestsControllerCreate,
  useGuestsControllerRemove,
  useGuestsControllerUpdate,
} from '@/api';
import { Button } from '@/components/Button';
import { AlertModal } from '@modules/Shared/AlertModal/AlertModal';
import { DatePicker } from '@modules/Shared/DatePicker/DatePicker';
import { Modal } from '@modules/Shared/Modal/Modal';
import { useAlert } from '@modules/Shared/Providers/AlertModalProvider';
import { queryClient } from '@modules/Shared/Providers/TanstackQueryProvider';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  show: boolean;
  selectedGuest: GuestObject;
  closeModal: () => void;
  apartment: SingleApartmentDto;
};

export const EditGuest: FC<Props> = ({
  show,
  closeModal,
  selectedGuest,
  apartment,
}) => {
  const { showAlert } = useAlert();
  const t = useTranslations('AddNewGuest');

  const [guestInfo, setGuestInfo] = useState<GuestObject>(selectedGuest);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<string>('');

  const requiredFields: Partial<keyof typeof guestInfo>[] = [
    'name',
    'PID',
    'dateOfBirth',
    'dateOfArrival',
    'dateOfDeparture',
  ];

  const checkForRequiredFields = () => {
    const errors: string[] = [];
    requiredFields.forEach((field: keyof typeof guestInfo) => {
      if (!guestInfo[field]) {
        errors.push(field);
      }
    });
    setErrors(errors);
    return errors.length === 0;
  };

  const sortedInputs: Partial<keyof typeof guestInfo>[] = [
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

  const { mutate: updateGuest, isPending: updateGuestIsPending } =
    useGuestsControllerUpdate({
      mutation: {
        mutationKey: ['guests-update'],
        onSuccess: data => {
          toast.success(t('guest_updated'));
          queryClient.refetchQueries({
            queryKey: ['guests', apartment.id],
          });
          closeModal();
        },
        onError: error => {
          toast.error(error.response?.data.message);
        },
      },
    });

  const { mutate: removeGuest, isPending: removeGuestIsPending } =
    useGuestsControllerRemove({
      mutation: {
        mutationKey: ['guests-remove'],
        onSuccess: data => {
          toast.success(t('guest_removed'));
          queryClient.refetchQueries({
            queryKey: ['guests', apartment.id],
          });
          closeModal();
        },
        onError: error => {
          toast.error(error.response?.data.message);
        },
      },
    });

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
            {sortedInputs.map(key => {
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
                          guestInfo[key]
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
                            : guestInfo[key]
                        }
                        onClick={() => setShowDatePicker(key)}
                      />
                      {showDatePicker === key && (
                        <DatePicker
                          type='date'
                          hideOnlyYearButton
                          closeDatePicker={() => setShowDatePicker('')}
                          showDatePicker={true}
                          initialDate={
                            guestInfo[
                              key as 'dateOfArrival' | 'dateOfDeparture'
                            ]
                          }
                          setDate={(date: string) => {
                            setErrors(prev => {
                              return prev.filter(error => error !== key);
                            });
                            setGuestInfo({
                              ...guestInfo,
                              [key]: date,
                            });
                          }}
                          resetData={() => {
                            setGuestInfo({
                              ...guestInfo,
                              [key]: '',
                            });
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <input
                      type='text'
                      name={key}
                      id={key}
                      className={`rounded-md border bg-white focus:border-blue-500 ${
                        errors.includes(key) ? 'border-red-500' : ''
                      }`}
                      value={guestInfo[key]}
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
          {selectedGuest && (
            <Button
              disabled={removeGuestIsPending}
              text={t('delete')}
              className='rounded-md bg-red-700 p-2 font-bold text-white hover:bg-red-500'
              onClick={async () => {
                showAlert(t('remove_guest'), false, async () => {
                  removeGuest({
                    apartmentId: apartment.id,
                    data: {
                      guestId: selectedGuest.id,
                      endDate: selectedGuest.dateOfDeparture,
                      startDate: selectedGuest.dateOfArrival,
                    },
                  });
                });
              }}
            />
          )}
          <Button
            text={t('save')}
            disabled={updateGuestIsPending}
            className='rounded-md bg-blue-700 p-2 font-bold text-white hover:bg-blue-500'
            onClick={async () => {
              if (checkForRequiredFields()) {
                updateGuest({
                  data: {
                    newGuestInfo: guestInfo,
                    oldGuestInfo: selectedGuest,
                  },
                  apartmentId: apartment.id,
                });
              }
            }}
          />
        </div>
      </div>
      <AlertModal />
    </Modal>
  );
};
