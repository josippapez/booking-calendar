import useMobileView from "../../../checkForMobileView";

type Props = {
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  selectedYear: number;
  selectedMonth: number;
  className?: string;
};

const DateNavigation = (props: Props) => {
  const {
    setSelectedYear,
    setSelectedMonth,
    selectedMonth,
    selectedYear,
    className,
  } = props;

  return (
    <div className={`${className} flex select-none gap-3 drop-shadow-md`}>
      <div
        className={`flex items-center ${
          useMobileView() ? "w-[165px]" : "w-36"
        } rounded-md h-10`}
      >
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
          className="hover:bg-neutral-100 p-5 rounded-l-md"
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
          className="hover:bg-neutral-100 p-5 rounded-r-md"
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
          className="hover:bg-neutral-100 p-5 rounded-l-md"
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
          className="hover:bg-neutral-100 p-5 rounded-r-md"
        />
      </div>
    </div>
  );
};

export default DateNavigation;
