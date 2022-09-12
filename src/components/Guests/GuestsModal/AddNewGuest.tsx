import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { saveGuestForApartment } from "../../../../store/firebaseActions/guestsActions";
import { useAppDispatch } from "../../../../store/hooks";
import DatePicker from "../../Shared/DatePicker/DatePicker";
import Modal from "../../Shared/Modal/Modal";

type Props = {
  show: boolean;
  closeModal: () => void;
};

export type Guest = {
  name: string;
  PID: string;
  dateOfBirth: string;
  country: string;
  address: string;
  dateOfArrival: string;
  dateOfDeparture: string;
  numberOfReceipt?: string;
  note: string;
};

const AddNewGuest = (props: Props) => {
  const { t, i18n } = useTranslation("AddNewGuest");
  const dispatch = useAppDispatch();
  const { show, closeModal } = props;
  const [guestInfo, setGuestInfo] = useState<Guest>({
    name: "",
    PID: "",
    dateOfBirth: "",
    country: "",
    address: "",
    dateOfArrival: "",
    dateOfDeparture: "",
    numberOfReceipt: "",
    note: "",
  });

  const [showDatePicker, setShowDatePicker] = useState<string>("");

  const checkForRequiredFields = () => {
    if (
      guestInfo.dateOfArrival === "" ||
      guestInfo.dateOfDeparture === "" ||
      guestInfo.name === "" ||
      guestInfo.PID === ""
    )
      return false;
    return true;
  };

  return (
    <Modal
      show={show}
      closeModal={closeModal}
      contentClassname="sm:w-10/12 md:w-1/2 lg:w-1/2 xl:w-1/3 w-10/12"
      animation="fade"
    >
      <div className="bg-white rounded-md shadow-md">
        <h1 className="bg-gray-200 rounded-t-md font-semibold px-10 py-4 text-center">
          {t("title")}
        </h1>
        <div className="p-5">
          <div className="flex flex-col gap-2">
            {Object.keys(guestInfo).map((key: string) => {
              return (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="font-semibold">
                    {t(key)}
                  </label>
                  {key.includes("dateOf") ? (
                    <>
                      <input
                        type="button"
                        name={key}
                        id={key}
                        className="bg-white border focus:border-blue-500 rounded-md"
                        value={
                          guestInfo[key as keyof Guest]
                            ? DateTime.fromISO(
                                guestInfo[
                                  key as keyof {
                                    dateOfArrival: string;
                                    dateOfDeparture: string;
                                  }
                                ]
                              )
                                .setLocale(i18n.language)
                                .toLocaleString({
                                  month: "long",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                            : guestInfo[key as keyof Guest]
                        }
                        onClick={() => setShowDatePicker(key)}
                      />
                      <DatePicker
                        closeDatePicker={() => setShowDatePicker("")}
                        showDatePicker={showDatePicker === key ? true : false}
                        initialDate={guestInfo[key as keyof Guest]}
                        setDate={(date: string) => {
                          setGuestInfo({
                            ...guestInfo,
                            [key as keyof Guest]: date,
                          });
                        }}
                        resetData={() => {
                          setGuestInfo({
                            ...guestInfo,
                            [key as keyof Guest]: "",
                          });
                        }}
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      id={key}
                      className="bg-white border focus:border-blue-500 rounded-md"
                      value={guestInfo[key as keyof Guest]}
                      onChange={e => {
                        setGuestInfo({
                          ...guestInfo,
                          [key]: e.target.value,
                        });
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between p-5">
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white p-2 rounded-md font-bold"
            onClick={closeModal}
          >
            {t("cancel")}
          </button>
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white p-2 rounded-md font-bold"
            onClick={async () => {
              if (checkForRequiredFields()) {
                await dispatch(saveGuestForApartment(guestInfo));
                closeModal();
              }
            }}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddNewGuest;
