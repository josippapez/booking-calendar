import {
  CreateEventDto,
  useEventsControllerAddNew,
  useEventsControllerUpdateExisting,
} from '@/api';
import { Modify } from '@/lib/utils';
import { DateRangePicker } from '@modules/Shared/DateRangePicker/DateRangePicker';
import { useSearchParams } from '@modules/Shared/Hooks/useFilterQuery';
import { Modal } from '@modules/Shared/Modal/Modal';
import { queryClient } from '@modules/Shared/Providers/TanstackQueryProvider';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import style from './CreateNewEvent.module.scss';

type ModifiedEvent = Modify<
  CreateEventDto,
  {
    id: string;
  }
>;

type Props = {
  show: boolean;
  setShow: (state: boolean) => void;
  showEdit: boolean;
  setShowEdit: (state: boolean) => void;
  selectedEventToEdit: ModifiedEvent | null;
  selectedDay: string | null;
};

export const CreateNewEvent: FC<Props> = ({
  show,
  setShow,
  setShowEdit,
  showEdit,
  selectedEventToEdit,
  selectedDay,
}) => {
  const t = useTranslations('CreateNewEvent');
  const { params } = useSearchParams();
  const apartmentId = params.get('id') || '';

  const [newEvent, setNewEvent] = useState<ModifiedEvent>({
    id: '',
    title: '',
    start: selectedDay ?? '',
    end: '',
    color: '',
    description: '',
    price: '',
    phone: '',
    booking: false,
    weekNumber: 0,
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);

  const { mutate: createEvent, isPending: createEventPending } =
    useEventsControllerAddNew({
      mutation: {
        onSuccess: () => {
          toast.success('Event created');
          queryClient.invalidateQueries({
            queryKey: ['events', apartmentId],
          });
        },
      },
    });

  const { mutate: updateEvent, isPending: updateEventPending } =
    useEventsControllerUpdateExisting({
      mutation: {
        onSuccess: () => {
          toast.success('Event updated');
          queryClient.invalidateQueries({
            queryKey: ['events', apartmentId],
          });
        },
      },
    });

  useEffect(() => {
    if (showEdit && selectedEventToEdit && selectedEventToEdit.id) {
      setNewEvent(selectedEventToEdit);
    }
  }, [selectedEventToEdit, showEdit]);

  useEffect(() => {
    return () => {
      if (!show && !showEdit) {
        setNewEvent({
          id: '',
          title: '',
          start: '',
          end: '',
          color: '',
          description: '',
          phone: '',
          booking: false,
          weekNumber: 0,
        });
      }
    };
  }, [show, showEdit]);

  const colors = [
    '#e63946',
    '#f72585',
    '#b5179e',
    '#480ca8',
    '#e773ad',
    '#f3b0ff',
    '#fca1d9',
    '#254D32',
    '#3A7D44',
    '#181D27',
    '#2b2d42',
    '#023047',
    '#27d9f7',
    '#80ffdb',
    '#fca311',
    '#fcab64',
  ];

  const bookingColor = '#00387e';

  return (
    <Modal
      animation='fade'
      width='min(90%, 400px)'
      show={show || showEdit}
      closeModal={() => {
        setShow(false);
        setShowEdit(false);
      }}
    >
      <div className='modal-header rounded-t-xl bg-gray-200 py-4'>
        <h2 className='text-center font-bold'>
          {t('add_new_reservation_title')}
        </h2>
      </div>
      <div className='modal-body bg-white p-4'>
        <div className='flex h-[36px]'>
          <span className='text-sm font-bold'>Booking</span>
          <input
            className='ml-2 h-4 w-4 rounded-full bg-white'
            type='checkbox'
            checked={newEvent.booking}
            onClick={() => setNewEvent({ ...newEvent, color: '' })}
            onChange={() => {
              setNewEvent({ ...newEvent, booking: !newEvent.booking });
            }}
          />
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col justify-center'>
            <label className='text-sm font-bold'>{t('title')}</label>
            <input
              className='rounded-md border bg-white placeholder:text-sm focus:border-blue-500'
              type='text'
              value={newEvent.title}
              onChange={e =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label className='text-sm font-bold'>{t('description')}</label>
            <input
              className='rounded-md border bg-white placeholder:text-sm focus:border-blue-500'
              type='text'
              value={newEvent.description}
              onChange={e =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label className='text-sm font-bold'>{t('price')}</label>
            <input
              className='rounded-md border bg-white placeholder:text-sm focus:border-blue-500'
              type='text'
              value={newEvent.price}
              onChange={e =>
                setNewEvent({ ...newEvent, price: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label className='text-sm font-bold'>{t('phone')}</label>
            <input
              className='rounded-md border bg-white placeholder:text-sm focus:border-blue-500'
              type='text'
              value={newEvent.phone}
              onChange={e =>
                setNewEvent({ ...newEvent, phone: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col justify-center'>
            <label className='text-sm font-bold'>{t('color')}</label>
            <div className='relative flex flex-col justify-center'>
              <input
                type='button'
                placeholder='Color'
                className={`${style.dropdownInput} cursor-pointer rounded-md border placeholder:text-sm focus:border-blue-500`}
                onClick={() => {
                  setOpenedDropdown(!openedDropdown);
                }}
                style={{
                  backgroundColor: newEvent.color,
                }}
              />
              {openedDropdown && (
                <div
                  className={`${style.dropdown} rounded-md border p-1 focus:border-blue-500`}
                >
                  {(newEvent.booking ? Array(bookingColor) : colors).map(
                    color => (
                      <div
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`${style.dropdownItem}`}
                        onClick={() => {
                          setNewEvent({
                            ...newEvent,
                            color: color,
                          });
                          setOpenedDropdown(false);
                        }}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='rounded-b-xl border-t-2 bg-gray-200 p-4'>
        <div
          className='flex flex-col justify-center text-center'
          onClick={() => {
            setShowDateRangePicker(true);
          }}
        >
          <label className='text-sm font-bold'>{t('date_range')}</label>
          <div className='flex w-full rounded-md border-2 border-slate-200 bg-white p-1'>
            <div className='w-[45%] font-bold'>
              {newEvent.start &&
                DateTime.fromISO(newEvent.start).toFormat('dd. MM. yyyy.')}
            </div>
            <div className='w-[10%] px-2'>-</div>
            <div className='w-[45%] font-bold'>
              {newEvent.end &&
                DateTime.fromISO(newEvent.end).toFormat('dd. MM. yyyy.')}
            </div>
          </div>
        </div>
        <div className='mt-3 flex justify-center'>
          <button
            className='font-bold'
            onClick={() => {
              if (showEdit && selectedEventToEdit) {
                updateEvent({
                  apartmentId,
                  data: {
                    oldEvent: selectedEventToEdit,
                    updatedEvent: newEvent,
                  },
                });
              } else {
                createEvent({
                  apartmentId,
                  data: newEvent,
                });
              }
              setShow(false);
              setShowEdit(false);
            }}
            style={{
              backgroundImage: `url(/Styles/Assets/Images/check.svg)`,
              height: '35px',
              width: '35px',
            }}
          />
        </div>
      </div>
      {showDateRangePicker && (
        <DateRangePicker
          event={newEvent}
          setEvent={setNewEvent}
          showDateRangePicker={true}
          setShowDateRangePicker={setShowDateRangePicker}
        />
      )}
    </Modal>
  );
};
