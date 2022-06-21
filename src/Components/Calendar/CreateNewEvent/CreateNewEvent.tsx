import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';
import Modal from '../../Shared/Modal/Modal';
import { Day, Event } from '../CalendarTypes';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { getRandomColor } from '../EventColors';

type Props = {
  show: boolean;
  setShow: (state: boolean) => void;
  setEvents: (events: { [key: string]: Event[] }) => void;
  events: { [key: string]: Event[] };
};

const CreateNewEvent = (props: Props) => {
  const { show, setShow, events, setEvents } = props;

  const [newEvent, setNewEvent] = useState<Event>({
    id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
    title: '',
    start: '',
    end: '',
    color: getRandomColor(),
    description: '',
    phone: '',
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  const eachDayOfRange = (startDate: string, endDate: string) => {
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);
    const monthDates: Day[] = [];

    const daysInMonth = end.diff(start, 'days');
    for (let i = 0; i <= daysInMonth.days; i++) {
      const day = start.plus({ days: i });
      monthDates.push({
        day: day.day,
        date: day.toFormat('yyyy-MM-dd'),
        name: day.toFormat('EEEE'),
        lastMonth: false,
      });
    }

    return monthDates;
  };

  return (
    <>
      <Modal animation='fade' show={show} closeModal={() => setShow(false)}>
        <div className='p-4 bg-white rounded-md'>
          <h2 className='text-center font-bold'>Add New Reservation</h2>
          <div className='flex justify-center'>
            <input
              className='bg-slate-100 border-2 border-slate-300 rounded-md p-2'
              type='text'
              placeholder='Title'
              onChange={e =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
          </div>
          <div className='flex justify-center'>
            <input
              className='bg-slate-100 border-2 border-slate-300 rounded-md p-2'
              type='text'
              placeholder='Description'
              onChange={e =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
          </div>
          <div
            className='flex justify-center'
            onClick={() => {
              setShowDateRangePicker(true);
            }}
          >
            <div className='bg-slate-100 border-2 border-slate-300 rounded-md p-2 w-full'>
              <label className='text-xs font-bold'>Date range</label>
              <div>
                {newEvent.start} - {newEvent.end}
              </div>
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              className='bg-slate-200 hover:bg-slate-500 font-bold py-2 px-4 rounded text-lg'
              onClick={() => {
                setNewEvent({
                  ...newEvent,
                  color: getRandomColor(),
                });
                const dates = eachDayOfRange(newEvent.start, newEvent.end);

                setEvents({
                  ...events,
                  ...dates.reduce(
                    (acc, date) => ({
                      ...acc,
                      [date.date]: [...(events[date.date] || []), newEvent],
                    }),
                    {}
                  ),
                });
                setShow(false);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
      <DateRangePicker
        event={newEvent}
        setEvent={setNewEvent}
        showDateRangePicker={showDateRangePicker}
        setShowDateRangePicker={setShowDateRangePicker}
      />
    </>
  );
};

export default CreateNewEvent;
