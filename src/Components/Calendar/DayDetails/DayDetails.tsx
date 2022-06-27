import { useEffect, useState } from 'react';
import Modal from '../../Shared/Modal/Modal';
import { Event } from '../CalendarTypes';

type Props = {
  show: boolean;
  setShow: (state: boolean) => void;
  events: Event[];
  isMobileView: boolean;
  removeEvent: (eventId: string) => void;
};

const DayDetails = (props: Props) => {
  const { show, setShow, events, isMobileView, removeEvent } = props;

  const [selectedEvent, setSelectedEvent] = useState<null | Event>(null);

  useEffect(() => {
    if (!events || events.length === 0) {
      setShow(false);
    }
  }, [events]);

  return (
    <Modal
      animation='slide-bottom'
      position='bottom'
      show={show}
      closeModal={() => setShow(false)}
    >
      <div
        className='p-4 bg-white rounded-t-md'
        style={{
          width: isMobileView ? '100vw' : '80vw',
          minHeight: isMobileView ? '100vh' : '30vh',
        }}
      >
        {events &&
          events.length &&
          events.map((event, index) => (
            <div
              key={event.id}
              className={`flex flex-col bg-gray-200 py-3 px-2 rounded cursor-pointer items-center ${
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
              <div className='flex justify-between w-full'>
                <div className='flex items-center'>
                  <div
                    className='rounded-full font-bold h-6 w-6 text-center'
                    style={{
                      backgroundColor: event.color,
                      color: 'white',
                    }}
                  >
                    {event.booking && 'B'}
                  </div>
                  <div
                    className='flex w-[80%] justify-between items-center p-2'
                    style={{
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div className='flex-1'>{event.title}</div>
                    <div className='flex-1'>{event.description}</div>
                  </div>
                </div>
                <button
                  className='bg-gray-300 hover:bg-slate-500 font-bold py-2 px-4 rounded text-lg'
                  onClick={() => {
                    removeEvent(event.id);
                  }}
                >
                  -
                </button>
              </div>
              {selectedEvent && selectedEvent.id === event.id && (
                <div className='flex flex-col w-full p-2'>
                  <div className='flex-1'>Title: {event.title}</div>
                  <div className='flex-1'>Description: {event.description}</div>
                  <div className='flex-1'>Phone: {event.phone}</div>
                  <div className='flex-1'>Price: {event.price}</div>
                </div>
              )}
            </div>
          ))}
      </div>
    </Modal>
  );
};

export default DayDetails;
