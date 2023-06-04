import { useAppDispatch } from '@/store/hooks';
import { sendEmail } from '@/store/sendgridActions/emailActions';
import { EventsByYear } from '@modules/Calendar/CalendarTypes';
import { DateRangePicker } from '@modules/Shared/DateRangePicker/DateRangePicker';
import { Modal } from '@modules/Shared/Modal/Modal';
import { DateTime } from 'luxon';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  show: boolean;
  setShow: (state: boolean) => void;
  currentReservations: EventsByYear;
  apartmentEmail: string;
};

export const CreateNewReservation: FC<Props> = ({
  show,
  setShow,
  currentReservations,
  apartmentEmail,
}) => {
  const { t } = useTranslation('CreateNewReservation');
  const dispatch = useAppDispatch();

  const [newReservation, setNewReservation] = useState({
    id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
    title: '',
    phone: '',
    start: '',
    end: '',
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [formError, setFormError] = useState(false);

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
              <button
                className={`${
                  formError
                    ? 'bg-red-500 hover:bg-red-400'
                    : 'bg-blue-500 hover:bg-blue-400'
                } w-full rounded-md px-4 py-2 text-sm font-bold text-white`}
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
                  setShow(false);
                  dispatch(sendEmail(newReservation, apartmentEmail));
                }}
              >
                {t('send')}
              </button>
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
