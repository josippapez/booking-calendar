import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DateRangePicker from "../../Shared/DateRangePicker/DateRangePicker";
import Modal from "../../Shared/Modal/Modal";
import { Day, Event, EventsByYear } from "../CalendarTypes";
import style from "./CreateNewEvent.module.scss";

type Props = {
  show: boolean;
  setShow: (state: boolean) => void;
  showEdit: boolean;
  setShowEdit: (state: boolean) => void;
  selectedEventToEdit: Event | null;
  setEvents: (events: EventsByYear) => void;
  events: EventsByYear;
};

const CreateNewEvent = (props: Props) => {
  const {
    show,
    setShow,
    events,
    setEvents,
    setShowEdit,
    showEdit,
    selectedEventToEdit,
  } = props;

  const { t } = useTranslation("CreateNewEvent");

  const [newEvent, setNewEvent] = useState<Event>({
    id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
    title: "",
    start: "",
    end: "",
    color: "",
    description: "",
    phone: "",
    booking: false,
    weekNumber: 0,
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);

  const eachDayOfRange = (startDate: string, endDate: string) => {
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);
    const monthDates: Day[] = [];

    const daysInMonth = end.diff(start, "days");
    for (let i = 0; i <= daysInMonth.days; i++) {
      const day = start.plus({ days: i });
      monthDates.push({
        day: day.day,
        date: day.toFormat("yyyy-MM-dd"),
        name: day.toFormat("EEEE"),
        year: day.year.toString(),
        lastMonth: false,
        weekNumber: day.weekNumber,
        startingDay: i === 0,
        endingDay: i === daysInMonth.days,
      });
    }

    return monthDates;
  };

  useEffect(() => {
    if (showEdit && selectedEventToEdit && selectedEventToEdit.id) {
      setNewEvent(selectedEventToEdit);
    }
    return () => {
      if (!show || !showEdit) {
        setNewEvent({
          id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
          title: "",
          start: "",
          end: "",
          color: "",
          description: "",
          phone: "",
          booking: false,
          weekNumber: 0,
        });
      }
    };
  }, [show, showEdit]);

  const colors = [
    "#e63946",
    "#f72585",
    "#b5179e",
    "#480ca8",
    "#e773ad",
    "#f3b0ff",
    "#fca1d9",
    "#254D32",
    "#3A7D44",
    "#181D27",
    "#2b2d42",
    "#023047",
    "#27d9f7",
    "#80ffdb",
    "#fca311",
    "#fcab64",
  ];

  const bookingColor = "#00387e";

  return (
    <>
      <Modal
        animation="fade"
        width="20rem"
        show={show || showEdit}
        closeModal={() => {
          setShow(false);
          setShowEdit(false);
        }}
      >
        <>
          <div className="modal-header rounded-t-xl bg-gray-200 py-4">
            <h2 className="text-center font-bold">
              {t("add_new_reservation_title")}
            </h2>
          </div>
          <div className="p-4 bg-white modal-body">
            <div className="flex h-[36px]">
              <span className="font-bold text-sm">Booking</span>
              <input
                className="bg-white rounded-full w-4 h-4 ml-2"
                type="checkbox"
                checked={newEvent.booking}
                onClick={() => setNewEvent({ ...newEvent, color: "" })}
                onChange={() => {
                  setNewEvent({ ...newEvent, booking: !newEvent.booking });
                }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col justify-center">
                <label className="text-sm font-bold">{t("title")}</label>
                <input
                  className="bg-white border focus:border-blue-500 rounded-md placeholder:text-sm"
                  type="text"
                  value={newEvent.title}
                  onChange={e =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col justify-center">
                <label className="text-sm font-bold">{t("description")}</label>
                <input
                  className="bg-white border focus:border-blue-500 rounded-md placeholder:text-sm"
                  type="text"
                  value={newEvent.description}
                  onChange={e =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col justify-center">
                <label className="text-sm font-bold">{t("phone")}</label>
                <input
                  className="bg-white border focus:border-blue-500 rounded-md placeholder:text-sm"
                  type="text"
                  value={newEvent.phone}
                  onChange={e =>
                    setNewEvent({ ...newEvent, phone: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col justify-center">
                <label className="text-sm font-bold">{t("color")}</label>
                <div className="flex flex-col justify-center relative">
                  <input
                    type="button"
                    placeholder="Color"
                    className={`${style.dropdownInput} cursor-pointer border focus:border-blue-500 rounded-md placeholder:text-sm`}
                    onClick={() => {
                      setOpenedDropdown(!openedDropdown);
                    }}
                    style={{
                      backgroundColor: newEvent.color,
                    }}
                  />
                  {openedDropdown && (
                    <div
                      className={`${style.dropdown} border focus:border-blue-500 rounded-md p-1`}
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
          <div className="bg-gray-200 p-4 border-t-2 rounded-b-xl">
            <div
              className="flex flex-col justify-center text-center"
              onClick={() => {
                setShowDateRangePicker(true);
              }}
            >
              <label className="text-sm font-bold">{t("date_range")}</label>
              <div className="bg-white border-2 border-slate-200 rounded-md p-1 w-full flex">
                <div className="font-bold w-[45%]">
                  {newEvent.start &&
                    DateTime.fromISO(newEvent.start).toFormat("dd. MM. yyyy.")}
                </div>
                <div className="px-2 w-[10%]">-</div>
                <div className="font-bold w-[45%]">
                  {newEvent.end &&
                    DateTime.fromISO(newEvent.end).toFormat("dd. MM. yyyy.")}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <button
                className="font-bold"
                onClick={() => {
                  if (newEvent.start && newEvent.end && newEvent.color) {
                    let editedEvents = { ...events };
                    if (showEdit && selectedEventToEdit) {
                      const datesToEdit = eachDayOfRange(
                        selectedEventToEdit.start,
                        selectedEventToEdit.end
                      );
                      datesToEdit.map(date => {
                        if (editedEvents[date.year][date.date]) {
                          const eventForDayIndex = editedEvents[date.year][
                            date.date
                          ].findIndex(event => event.id === newEvent.id);

                          if (eventForDayIndex !== -1) {
                            editedEvents[date.year] = {
                              ...editedEvents[date.year],
                              [date.date]: [
                                ...editedEvents[date.year][date.date].filter(
                                  event => event.id !== newEvent.id
                                ),
                              ],
                            };
                          }
                        }
                      });
                    }
                    const dates = eachDayOfRange(newEvent.start, newEvent.end);
                    const newDates = dates.reduce(
                      (acc: EventsByYear, date: Day) => ({
                        ...acc,
                        [date.year]: {
                          ...acc[date.year],
                          [date.date]: [
                            ...((editedEvents[date.year] &&
                              editedEvents[date.year][date.date]) ||
                              []),
                            { ...newEvent, weekNumber: date.weekNumber },
                          ],
                        },
                      }),
                      {}
                    );
                    Object.keys(newDates).map(year => {
                      editedEvents[year] = {
                        ...editedEvents[year],
                        ...newDates[year],
                      };
                    });
                    setEvents(editedEvents);
                    setShow(false);
                    setShowEdit(false);
                  }
                }}
                style={{
                  backgroundImage: `url(/Styles/Assets/Images/check.svg)`,
                  height: "35px",
                  width: "35px",
                }}
              />
            </div>
          </div>
        </>
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
