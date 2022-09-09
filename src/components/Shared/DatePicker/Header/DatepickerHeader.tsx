import React from "react";

type Props = {
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
};

const DatepickerHeader = (props: Props) => {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    props;

  return (
    <div className="flex justify-center select-none gap-3 drop-shadow-md">
      <div className="flex items-center w-36 rounded-md h-10">
        <button
          onClick={() => {
            if (selectedMonth === 1) {
              setSelectedMonth(12);
              setSelectedYear(selectedYear - 1);
              return;
            }
            setSelectedMonth(selectedMonth - 1);
          }}
          style={{
            backgroundImage: `url(/Styles/Assets/Images/left-arrow.svg)`,
            backgroundSize: "75%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="bg-neutral-50 hover:bg-neutral-100 rounded-l-md p-5"
        />
        <h2 className="w-full text-center px-5 select-none font-bold">
          {selectedMonth}
        </h2>
        <button
          onClick={() => {
            if (selectedMonth === 12) {
              setSelectedMonth(1);
              setSelectedYear(selectedYear + 1);
              return;
            }
            setSelectedMonth(selectedMonth + 1);
          }}
          style={{
            backgroundImage: `url(/Styles/Assets/Images/right-arrow.svg)`,
            backgroundSize: "75%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="bg-neutral-50 hover:bg-neutral-100 rounded-r-md p-5"
        />
      </div>
      <div className="flex items-center w-[165px] rounded-md h-10">
        <button
          onClick={() => {
            setSelectedYear(selectedYear - 1);
          }}
          style={{
            backgroundImage: `url(/Styles/Assets/Images/left-arrow.svg)`,
            backgroundSize: "75%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="bg-neutral-50 hover:bg-neutral-100 rounded-l-md p-5"
        />
        <h2 className="w-full text-center px-5 select-none font-bold">
          {selectedYear}
        </h2>
        <button
          onClick={() => {
            setSelectedYear(selectedYear + 1);
          }}
          style={{
            backgroundImage: `url(/Styles/Assets/Images/right-arrow.svg)`,
            backgroundSize: "75%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="bg-neutral-50 hover:bg-neutral-100 rounded-r-md p-5"
        />
      </div>
    </div>
  );
};

export default DatepickerHeader;
