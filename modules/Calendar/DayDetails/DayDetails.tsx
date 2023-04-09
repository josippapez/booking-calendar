import { Event } from '@modules/Calendar/CalendarTypes';
import { Modal } from '@modules/Shared/Modal/Modal';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './DayDetails.module.scss';

type Props = {
  show: boolean;
  setShow: (state: boolean) => void;
  setShowEdit: (state: boolean) => void;
  setSelectedEventToEdit: (event: Event) => void;
  setSelectedDay: (day: string | null) => void;
  events: Event[];
  isMobileView: boolean;
  removeEvent: (event: Event) => void;
};

export const DayDetails: FC<Props> = ({
  show,
  setShow,
  events,
  isMobileView,
  removeEvent,
  setShowEdit,
  setSelectedEventToEdit,
  setSelectedDay,
}) => {
  const { t } = useTranslation('DayDetails');

  const [selectedEvent, setSelectedEvent] = useState<null | Event>(null);

  useEffect(() => {
    if (!events || events.length === 0) {
      setShow(false);
    }
    if (!show) {
      setSelectedDay(null);
    }
  }, [events, show]);

  return (
    <Modal
      animation={isMobileView ? 'fade' : 'slide-bottom'}
      position={isMobileView ? 'center' : 'bottom'}
      show={show}
      closeModal={() => setShow(false)}
    >
      <div
        className='rounded-md bg-white p-4'
        style={{
          width: isMobileView ? '90vw' : '50vw',
        }}
      >
        {events &&
          events.length &&
          events.map((event, index) => (
            <div
              key={event.id}
              className={`flex cursor-pointer flex-col items-center rounded px-2 py-3 ${
                index > 0 && 'mt-4'
              }`}
              onClick={() => {
                if (event.id === selectedEvent?.id) {
                  setSelectedEvent(null);
                  return;
                }
                setSelectedEvent(event);
              }}
            >
              <div className='flex h-10 w-full justify-between'>
                <div className='flex items-center'>
                  <div
                    className='h-6 w-6 rounded-full text-center font-bold'
                    style={{
                      backgroundColor: event.color,
                      color: 'white',
                    }}
                  >
                    {event.booking && 'B'}
                  </div>
                  <div
                    className='flex w-[80%] items-center justify-between p-2'
                    style={{
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div className='flex-1'>{event.title}</div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <button
                    className={`rounded-md px-4 py-2 hover:bg-neutral-200 ${style.editbutton}`}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedEventToEdit(event);
                      setShowEdit(true);
                    }}
                  />
                  <button
                    className={`rounded-md px-4 py-2 hover:bg-neutral-200 ${style.removeButton}`}
                    onClick={e => {
                      e.stopPropagation();
                      removeEvent(event);
                    }}
                  />
                </div>
              </div>
              {selectedEvent && selectedEvent.id === event.id && (
                <div className='flex w-full flex-col p-2'>
                  <div className='flex-1'>
                    {t('title')}: {event.title}
                  </div>
                  <div className='flex-1'>
                    {t('description')}: {event.description}
                  </div>
                  <div className='flex-1'>
                    {t('phone')}: {event.phone}
                  </div>
                  <div className='flex-1'>
                    {t('price')}: {event.price}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </Modal>
  );
};
