import { DateTime } from "luxon";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../DatePicker/DatePicker";

type Props = {
  value?: string;
  setValue: (value: string) => void;
  resetData: () => void;
};

const DateInput = (props: Props) => {
  const { value, setValue, resetData } = props;
  const { i18n } = useTranslation();

  const [displayDatePicker, setDisplayDatePicker] = useState(false);

  const handleDateChange = useCallback(
    (date: string) => {
      setValue(date);
      setDisplayDatePicker(false);
    },
    [setValue]
  );

  const handleResetData = useCallback(() => {
    resetData();
  }, [resetData]);

  return (
    <>
      <input
        type="button"
        className="appearance-none border bg-white rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
        value={
          value !== ""
            ? DateTime.fromISO(value as string)
                .setLocale(i18n.language)
                .toLocaleString({
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })
            : ""
        }
        onClick={() => {
          setDisplayDatePicker(true);
        }}
      />
      <DatePicker
        closeDatePicker={() => {
          setDisplayDatePicker(false);
        }}
        setDate={handleDateChange}
        resetData={handleResetData}
        showDatePicker={displayDatePicker}
        initialDate={value as string}
      />
    </>
  );
};

DateInput.defaultProps = {
  value: "",
};

export default DateInput;
