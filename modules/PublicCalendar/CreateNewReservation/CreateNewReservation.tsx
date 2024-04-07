import { EventObject, PublicEventsData, customClient } from '@/api';
import { Button } from '@/components/Button';
import { DateRangePicker } from '@modules/Shared/DateRangePicker/DateRangePicker';
import { Modal } from '@modules/Shared/Modal/Modal';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  show: boolean;
  setShow: (state: boolean) => void;
  currentReservations: PublicEventsData;
  apartmentEmail: string;
};

export const CreateNewReservation: FC<Props> = ({
  show,
  setShow,
  currentReservations,
  apartmentEmail,
}) => {
  const t = useTranslations('CreateNewReservation');

  const [newReservation, setNewReservation] = useState<EventObject>({
    id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
    title: '',
    phone: '',
    start: '',
    end: '',
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [formError, setFormError] = useState(false);

  const { mutate: sendEmail, isPending: sendEmailIsPending } = useMutation({
    mutationKey: ['sendEmail', apartmentEmail],
    mutationFn: async () => {
      await customClient({
        baseURL: '/',
        url: 'api/sendEmail',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          msg: {
            to: apartmentEmail,
            from: 'booking.calendar.os.app@gmail.com',
            subject: 'New reservation !!!!',
            dynamic_template_data: {
              start_date: DateTime.fromISO(newReservation.start).toLocaleString(
                DateTime.DATE_HUGE
              ),
              end_date: DateTime.fromISO(newReservation.end).toLocaleString(
                DateTime.DATE_HUGE
              ),
              reservation_name: newReservation.title,
              reservation_phone: newReservation.phone,
            },
          },
        },
      });
    },
    onSuccess: () => {
      toast.success(t('email_sent'));
      setShow(false);
      setNewReservation({
        id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
        title: '',
        start: '',
        end: '',
        phone: '',
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    return () => {
      if (!show) {
        setNewReservation({
          id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
          title: '',
          start: '',
          end: '',
          phone: '',
        });
        setFormError(false);
      }
    };
  }, [show]);

  return (
    <>
      <Modal
        width='min(25rem, 100%)'
        animation='fade'
        show={show}
        closeModal={() => {
          setShow(false);
        }}
      >
        <div>
          <div className='modal-header rounded-t-xl bg-gray-200 p-4'>
            <h2 className='text-center font-bold'>
              {t('add_new_reservation_title')}
            </h2>
          </div>
          <div className='modal-body flex flex-col gap-3 bg-white p-4'>
            <div className='flex flex-col'>
              <label className='text-sm font-bold'>
                {t('name_and_surname')}
              </label>
              <input
                className='rounded-md border bg-white placeholder:text-sm focus:border-blue-500'
                type='text'
                value={newReservation.title}
                onChange={event => {
                  setNewReservation({
                    ...newReservation,
                    title: event.target.value,
                  });
                }}
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm font-bold'>{t('phone')}</label>
              <input
                className='rounded-md border bg-white placeholder:text-sm focus:border-blue-500'
                type='text'
                value={newReservation.phone}
                onChange={event => {
                  setNewReservation({
                    ...newReservation,
                    phone: event.target.value,
                  });
                }}
              />
            </div>
            <div
              className='flex flex-col justify-center text-center'
              onClick={() => {
                setShowDateRangePicker(true);
              }}
            >
              <label className='text-sm font-bold'>{t('date_range')}</label>
              <div className='flex w-full rounded-md border bg-white p-1'>
                <div className='w-[45%] font-bold'>
                  {newReservation.start &&
                    DateTime.fromISO(newReservation.start).toFormat(
                      'dd. MM. yyyy.'
                    )}
                </div>
                <div className='w-[10%] px-2'>-</div>
                <div className='w-[45%] font-bold'>
                  {newReservation.end &&
                    DateTime.fromISO(newReservation.end).toFormat(
                      'dd. MM. yyyy.'
                    )}
                </div>
              </div>
            </div>
            {formError && (
              <div className='flex flex-col font-bold text-red-500'>
                {t('error_fields_required')}
              </div>
            )}
          </div>
          <div className='modal-footer rounded-b-xl bg-gray-200 p-4'>
            <div className='flex justify-center'>
              <Button
                disabled={sendEmailIsPending}
                text={t('send')}
                className={cn(
                  'w-full rounded-md px-4 py-2 text-sm font-bold text-white',
                  formError
                    ? 'bg-red-500 hover:bg-red-400'
                    : 'bg-blue-500 hover:bg-blue-400'
                )}
                onClick={() => {
                  if (
                    !newReservation.title ||
                    !newReservation.start ||
                    !newReservation.end ||
                    !newReservation.phone
                  ) {
                    setFormError(true);
                    return;
                  }
                  sendEmail();
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
      <DateRangePicker
        event={newReservation}
        setEvent={setNewReservation}
        showDateRangePicker={showDateRangePicker}
        setShowDateRangePicker={setShowDateRangePicker}
        disableForCurrentReservations={true}
        currentReservations={currentReservations}
      />
    </>
  );
};
