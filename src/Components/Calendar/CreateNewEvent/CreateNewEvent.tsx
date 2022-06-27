import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import Images from '../../../Styles/Assets/Images/Images';
import Modal from '../../Shared/Modal/Modal';
import { Day, Event } from '../CalendarTypes';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import style from './CreateNewEvent.module.scss';

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
    color: '',
    description: '',
    phone: '',
    booking: false,
    weekNumber: 0,
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [opennedDropdown, setOpennedDropdown] = useState(false);

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
        weekNumber: day.weekNumber,
      });
    }

    return monthDates;
  };

  useEffect(() => {
    return () => {
      if (!show) {
        setNewEvent({
          id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
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
  }, [show]);

  const colors = [
    '#e63946',
    '#f72585',
    '#b5179e',
    '#480ca8',
    '#e773ad',
    '#f3b0ff',
    '#fca1d9',
    '#b2f726',
    '#2b2d42',
    '#023047',
    '#27d9f7',
    '#80ffdb',
    '#fca311',
    '#fcab64',
  ];

  const bookingColor = '#00387e';

  return (
    <>
      <Modal animation='fade' show={show} closeModal={() => setShow(false)}>
        <div>
          <div className='p-4 bg-white rounded-t-md'>
            <h2 className='text-center font-bold mb-4'>Add New Reservation</h2>
            <div className='flex h-[36px]'>
              <span className='font-bold text-sm'>Booking</span>
              <input
                className='bg-white rounded-full w-4 h-4 ml-2'
                type='checkbox'
                checked={newEvent.booking}
                onClick={() => setNewEvent({ ...newEvent, color: '' })}
                onChange={() => {
                  setNewEvent({ ...newEvent, booking: !newEvent.booking });
                }}
              />
            </div>
            <div className='flex flex-col gap-3'>
              <div className='flex justify-center'>
                <input
                  className='bg-white border-2 border-gray-100 rounded-md p-1 placeholder:text-sm'
                  type='text'
                  placeholder='Title'
                  value={newEvent.title}
                  onChange={e =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div className='flex justify-center'>
                <input
                  className='bg-white border-2 border-gray-100 rounded-md p-1 placeholder:text-sm'
                  type='text'
                  placeholder='Description'
                  value={newEvent.description}
                  onChange={e =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </div>
              <div className='flex justify-center'>
                <input
                  className='bg-white border-2 border-gray-100 rounded-md p-1 placeholder:text-sm'
                  type='text'
                  placeholder='Phone'
                  value={newEvent.phone}
                  onChange={e =>
                    setNewEvent({ ...newEvent, phone: e.target.value })
                  }
                />
              </div>
              <div className='flex flex-col justify-center relative'>
                <input
                  type={'button'}
                  placeholder='Color'
                  className={`${style.dropdownInput} cursor-pointer border-2 border-gray-100 rounded-md p-1 placeholder:text-sm`}
                  onClick={() => {
                    setOpennedDropdown(!opennedDropdown);
                  }}
                  style={{
                    backgroundColor: newEvent.color,
                  }}
                />
                {opennedDropdown && (
                  <div
                    className={`${style.dropdown} border-2 border-gray-100 rounded-md p-1`}
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
                            setOpennedDropdown(false);
                          }}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='bg-gray-200 p-4 border-t-2 rounded-b-md'>
            <div
              className='flex flex-col justify-center'
              onClick={() => {
                setShowDateRangePicker(true);
              }}
            >
              <label className='text-sm font-bold'>Date range</label>
              <div className='bg-white border-2 border-slate-200 rounded-md p-1 w-full flex'>
                <div className='font-bold w-[45%]'>
                  {newEvent.start &&
                    DateTime.fromISO(newEvent.start).toFormat('dd. MM. yyyy.')}
                </div>
                <div className='px-2 text-center w-[10%]'>-</div>
                <div className='font-bold w-[45%]'>
                  {newEvent.end &&
                    DateTime.fromISO(newEvent.end).toFormat('dd. MM. yyyy.')}
                </div>
              </div>
            </div>
            <div className='flex justify-center mt-3'>
              <button
                className='font-bold'
                onClick={() => {
                  if (
                    newEvent.title &&
                    newEvent.start &&
                    newEvent.end &&
                    newEvent.color
                  ) {
                    const dates = eachDayOfRange(newEvent.start, newEvent.end);
                    setEvents({
                      ...events,
                      ...dates.reduce(
                        (acc, date) => ({
                          ...acc,
                          [date.date]: [
                            ...((events && events[date.date]) || []),
                            { ...newEvent, weekNumber: date.weekNumber },
                          ],
                        }),
                        {}
                      ),
                    });
                    setShow(false);
                  }
                }}
                style={{
                  backgroundImage: `url(${Images.Check})`,
                  height: '35px',
                  width: '35px',
                }}
              />
            </div>
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
