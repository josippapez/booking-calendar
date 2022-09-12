import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useCalculateEachDayOfMonth from "../../../Hooks/calculateEachDayOfMonth";
import { Day } from "../../Calendar/CalendarTypes";
import Modal from "../Modal/Modal";
import DatePickerDates from "./Dates/DatePickerDates";
import DatePickerHeader from "./Header/DatePickerHeader";

type Props = {
  showDatePicker: boolean;
  closeDatePicker: () => void;
  initialDate?: string;
  setDate: (date: string) => void;
  resetData: () => void;
  disabledCondition?: boolean;
  customDisplayDate?: (day: Day, index: number) => JSX.Element;
};

const DatePicker = (props: Props) => {
  const {
    showDatePicker,
    closeDatePicker,
    initialDate,
    setDate,
    resetData,
    disabledCondition,
  } = props;
  const { t } = useTranslation("DatePicker");

  const [selectedYear, setSelectedYear] = useState<number>(
    DateTime.local().year
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    DateTime.local().month
  );

  const eachDayOfMonth = useCalculateEachDayOfMonth({
    year: selectedYear,
    month: selectedMonth,
  });

  return (
    <Modal
      animation="fade"
      show={showDatePicker}
      closeModal={closeDatePicker}
      zindex={10}
    >
      <div className="p-4 bg-white rounded-md relative">
        <DatePickerHeader
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
        />
        <div className="my-4">
          <DatePickerDates
            dates={eachDayOfMonth}
            initialDate={initialDate}
            setDate={setDate}
            disabledCondition={disabledCondition}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="hover:bg-slate-200 font-bold py-2 px-4 rounded"
            onClick={() => {
              closeDatePicker();
              resetData();
            }}
          >
            {t("cancel")}
          </button>
          <button
            className="hover:bg-slate-200 font-bold py-2 px-4 rounded"
            onClick={() => {
              resetData();
            }}
          >
            {t("clear")}
          </button>
          <button
            className="hover:bg-slate-200 font-bold py-2 px-4 rounded"
            onClick={() => {
              closeDatePicker();
            }}
          >
            {t("done")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DatePicker;
