import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../../store/hooks";
import { Events } from "../../../../store/reducers/events";
import { sendEmail } from "../../../../store/sendgridActions/emailActions";
import Modal from "../../Shared/Modal/Modal";
import DateRangePicker from "../DateRangePicker/DateRangePicker";

type Props = {
  show: boolean;
  setShow: (state: boolean) => void;
  currentReservations: Events;
  apartmentEmail: string;
};

const CreateNewReservation = (props: Props) => {
  const { show, setShow, currentReservations, apartmentEmail } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [newReservation, setNewReservation] = useState({
    id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
    title: "",
    phone: "",
    start: "",
    end: "",
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    return () => {
      if (!show) {
        setNewReservation({
          id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
          title: "",
          start: "",
          end: "",
          phone: "",
        });
        setFormError(false);
      }
    };
  }, [show]);

  return (
    <>
      <Modal
        animation="fade"
        show={show}
        closeModal={() => {
          setShow(false);
        }}
      >
        <div>
          <div className="modal-header bg-gray-200 p-4 rounded-t-xl">
            <h2 className="text-center font-bold">
              {t("add_new_reservation_title")}
            </h2>
          </div>
          <div className="modal-body bg-white p-4 gap-3 flex flex-col">
            <div className="flex flex-col">
              <label className="text-sm font-bold">
                {t("name_and_surname")}
              </label>
              <input
                className="bg-white border focus:border-blue-500 rounded-md placeholder:text-sm"
                type="text"
                value={newReservation.title}
                onChange={event => {
                  setNewReservation({
                    ...newReservation,
                    title: event.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold">{t("phone")}</label>
              <input
                className="bg-white border focus:border-blue-500 rounded-md placeholder:text-sm"
                type="text"
                value={newReservation.phone}
                onChange={event => {
                  setNewReservation({
                    ...newReservation,
                    phone: event.target.value,
                  });
                }}
              />
            </div>
            <div
              className="flex flex-col justify-center text-center"
              onClick={() => {
                setShowDateRangePicker(true);
              }}
            >
              <label className="text-sm font-bold">{t("date_range")}</label>
              <div className="bg-white border rounded-md p-1 w-full flex">
                <div className="font-bold w-[45%]">
                  {newReservation.start &&
                    DateTime.fromISO(newReservation.start).toFormat(
                      "dd. MM. yyyy."
                    )}
                </div>
                <div className="px-2 w-[10%]">-</div>
                <div className="font-bold w-[45%]">
                  {newReservation.end &&
                    DateTime.fromISO(newReservation.end).toFormat(
                      "dd. MM. yyyy."
                    )}
                </div>
              </div>
            </div>
            {formError && (
              <div className="flex flex-col text-red-500 font-bold">
                {t("error_fields_required")}
              </div>
            )}
          </div>
          <div className="modal-footer bg-gray-200 p-4 rounded-b-xl">
            <div className="flex justify-center">
              <button
                className={`${
                  formError
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-blue-500 hover:bg-blue-400"
                } w-full px-4 py-2 rounded-md text-sm font-bold text-white`}
                onClick={() => {
                  if (
                    !newReservation.title ||
                    !newReservation.start ||
                    !newReservation.end ||
                    !newReservation.phone
                  ) {
                    setFormError(true);
                    return;
                  }
                  setShow(false);
                  dispatch(sendEmail(newReservation, apartmentEmail));
                }}
              >
                {t("send")}
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <DateRangePicker
        event={newReservation}
        setEvent={setNewReservation}
        showDateRangePicker={showDateRangePicker}
        setShowDateRangePicker={setShowDateRangePicker}
        disableForCurrentReservations={true}
        currentReservations={currentReservations}
      />
    </>
  );
};

export default CreateNewReservation;
