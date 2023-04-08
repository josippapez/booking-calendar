import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Shared/Modal/Modal";
import { Event } from "../CalendarTypes";
import style from "./DayDetails.module.scss";

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

const DayDetails = (props: Props) => {
  const {
    show,
    setShow,
    events,
    isMobileView,
    removeEvent,
    setShowEdit,
    setSelectedEventToEdit,
    setSelectedDay,
  } = props;

  const { t } = useTranslation("DayDetails");

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
      animation={isMobileView ? "fade" : "slide-bottom"}
      position={isMobileView ? "center" : "bottom"}
      show={show}
      closeModal={() => setShow(false)}
    >
      <div
        className="p-4 bg-white rounded-md"
        style={{
          width: isMobileView ? "90vw" : "50vw",
        }}
      >
        {events &&
          events.length &&
          events.map((event, index) => (
            <div
              key={event.id}
              className={`flex flex-col py-3 px-2 rounded cursor-pointer items-center ${
                index > 0 && "mt-4"
              }`}
              onClick={() => {
                if (event.id === selectedEvent?.id) {
                  setSelectedEvent(null);
                  return;
                }
                setSelectedEvent(event);
              }}
            >
              <div className="flex justify-between w-full h-10">
                <div className="flex items-center">
                  <div
                    className="rounded-full font-bold h-6 w-6 text-center"
                    style={{
                      backgroundColor: event.color,
                      color: "white",
                    }}
                  >
                    {event.booking && "B"}
                  </div>
                  <div
                    className="flex w-[80%] justify-between items-center p-2"
                    style={{
                      borderRadius: "0.5rem",
                    }}
                  >
                    <div className="flex-1">{event.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className={`hover:bg-neutral-200 py-2 px-4 rounded-md ${style.editbutton}`}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedEventToEdit(event);
                      setShowEdit(true);
                    }}
                  />
                  <button
                    className={`hover:bg-neutral-200 py-2 px-4 rounded-md ${style.removeButton}`}
                    onClick={e => {
                      e.stopPropagation();
                      removeEvent(event);
                    }}
                  />
                </div>
              </div>
              {selectedEvent && selectedEvent.id === event.id && (
                <div className="flex flex-col w-full p-2">
                  <div className="flex-1">
                    {t("title")}: {event.title}
                  </div>
                  <div className="flex-1">
                    {t("description")}: {event.description}
                  </div>
                  <div className="flex-1">
                    {t("phone")}: {event.phone}
                  </div>
                  <div className="flex-1">
                    {t("price")}: {event.price}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </Modal>
  );
};

export default DayDetails;
