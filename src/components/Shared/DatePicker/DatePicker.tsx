import { useCalculateEachDayOfMonth } from '@/Hooks/calculateEachDayOfMonth';
import { Day } from '@/components/Calendar/CalendarTypes';
import { DatePickerDates } from '@/components/Shared/DatePicker/Dates/DatePickerDates';
import { Months } from '@/components/Shared/DatePicker/Dates/Months';
import { Years } from '@/components/Shared/DatePicker/Dates/Years';
import { DatePickerHeader } from '@/components/Shared/DatePicker/Header';
import { Modal } from '@/components/Shared/Modal/Modal';
import { DateTime } from 'luxon';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  type: 'date' | 'month' | 'year';
  showDatePicker: boolean;
  closeDatePicker: () => void;
  initialDate?: string;
  startYear?: number;
  setDate: (date: string) => void;
  resetData: () => void;
  disabledCondition?: boolean;
  customDisplayDate?: (day: Day, index: number) => JSX.Element;
  hideYear?: boolean;
  hideOnlyYearButton?: boolean;
};

export const DatePicker: FC<Props> = ({
  showDatePicker,
  closeDatePicker,
  initialDate,
  setDate,
  resetData,
  disabledCondition,
  startYear,
  type = 'date',
  hideOnlyYearButton,
  hideYear,
  customDisplayDate,
}) => {
  const { t } = useTranslation('DatePicker');
  const [tempDate, setTempDate] = useState(initialDate || '');
  const [showYearPicker, setShowYearPicker] = useState(
    initialDate?.length === 4
  );

  const eachDayOfMonth = useCalculateEachDayOfMonth({
    startYear: startYear || DateTime.local().year,
    startMonth: DateTime.local().month,
  });

  const { month, year, setmonth, setyear } = eachDayOfMonth;

  const selectedType = showYearPicker ? 'year' : type;

  useEffect(() => {
    if (initialDate) {
      setmonth(DateTime.fromISO(initialDate).month);
      setyear(DateTime.fromISO(initialDate).year);
    }
  }, [initialDate]);

  return (
    <Modal
      animation='fade'
      show={showDatePicker}
      closeModal={closeDatePicker}
      zindex={10}
    >
      <div className='text-almost-black relative rounded-md bg-white p-4'>
        <DatePickerHeader
          type={selectedType}
          hideMonth={selectedType === 'year' || selectedType === 'month'}
          hideYear={hideYear}
          hideOnlyYearButton={hideOnlyYearButton}
          selectedMonth={month}
          selectedYear={year}
          setSelectedMonth={setmonth}
          setSelectedYear={setyear}
          setShowYearPicker={() => {
            setShowYearPicker(prev => !prev);
            if (!showYearPicker) {
              setTempDate(year.toString());
            }
          }}
        />
        <div className='my-4'>
          {selectedType === 'year' && (
            <Years
              initialYear={year.toString()}
              selectedYear={DateTime.fromISO(tempDate).year.toString()}
              setDate={setTempDate}
              disabledCondition={disabledCondition}
            />
          )}
          {selectedType === 'month' && (
            <Months
              dates={eachDayOfMonth}
              initialDate={tempDate}
              setDate={setTempDate}
              disabledCondition={disabledCondition}
            />
          )}
          {selectedType === 'date' && (
            <DatePickerDates
              dates={eachDayOfMonth}
              initialDate={tempDate}
              setDate={setTempDate}
              disabledCondition={disabledCondition}
              customDisplayDate={customDisplayDate}
            />
          )}
        </div>
        <div className='flex justify-end'>
          <button
            className='rounded px-4 py-2 font-bold hover:bg-slate-200'
            onClick={() => {
              closeDatePicker();
              resetData();
            }}
          >
            {t('cancel')}
          </button>
          <button
            className='rounded px-4 py-2 font-bold hover:bg-slate-200'
            onClick={() => {
              closeDatePicker();
              resetData();
            }}
          >
            {t('clear')}
          </button>
          <button
            className='rounded px-4 py-2 font-bold hover:bg-slate-200'
            onClick={() => {
              setDate(tempDate);
              closeDatePicker();
            }}
          >
            {t('done')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
