import { DateTime } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteGuestForApartment,
  saveGuestForApartment,
} from "../../../../store/firebaseActions/guestsActions";
import { useAppDispatch } from "../../../../store/hooks";
import { useAlert } from "../../../AlertModalProvider";
import DatePicker from "../../Shared/DatePicker/DatePicker";
import Modal from "../../Shared/Modal/Modal";

type Props = {
  show: boolean;
  selectedGuest?: Guest;
  selectedGuestId?: string;
  closeModal: () => void;
};

export type Guest = {
  name: string;
  PID: string;
  travelIdNumber: string;
  dateOfBirth: string;
  dateOfArrival: string;
  dateOfDeparture: string;
  country: string;
  city: string;
  address: string;
  numberOfInvoice?: string;
  note: string;
};

const AddNewGuest = (props: Props) => {
  const { showAlert } = useAlert();
  const { t, i18n } = useTranslation("AddNewGuest");
  const dispatch = useAppDispatch();
  const { show, closeModal, selectedGuest, selectedGuestId } = props;
  const [guestInfo, setGuestInfo] = useState<Guest>(
    selectedGuest || {
      name: "",
      PID: "",
      dateOfBirth: "",
      dateOfArrival: "",
      dateOfDeparture: "",
      country: "",
      city: "",
      address: "",
      numberOfInvoice: "",
      travelIdNumber: "",
      note: "",
    }
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<string>("");

  const requiredFileds = [
    "name",
    "PID",
    "dateOfBirth",
    "dateOfArrival",
    "dateOfDeparture",
  ];

  const checkForRequiredFields = () => {
    const errors: string[] = [];
    requiredFileds.forEach((field: string) => {
      if (!guestInfo[field as keyof Guest]) {
        errors.push(field);
      }
    });
    setErrors(errors);
    return errors.length === 0;
  };

  const sortInputs = (a: string, b: string) => {
    if (
      ["name", "PID", "dateOfBirth", "dateOfArrival", "dateOfBirth"].includes(a)
    ) {
      return -1;
    }
    if (
      ["name", "PID", "dateOfBirth", "dateOfArrival", "dateOfBirth"].includes(b)
    ) {
      return 1;
    }
    return 0;
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
            {Object.keys(guestInfo)
              .sort((a, b) => {
                return sortInputs(a, b);
              })
              .map((key: string) => {
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
                          className={`bg-white border focus:border-blue-500 rounded-md ${
                            errors.includes(key) ? "border-red-500" : ""
                          }`}
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
                            setErrors(prev => {
                              return prev.filter(error => error !== key);
                            });
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
                        className={`bg-white border focus:border-blue-500 rounded-md ${
                          errors.includes(key) ? "border-red-500" : ""
                        }`}
                        value={guestInfo[key as keyof Guest]}
                        onChange={e => {
                          setErrors(prev => {
                            return prev.filter(error => error !== key);
                          });
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
          {selectedGuest && selectedGuestId && (
            <button
              className="bg-red-700 hover:bg-red-500 text-white p-2 rounded-md font-bold"
              onClick={async () => {
                showAlert(t("remove_guest"), false, () => async () => {
                  await dispatch(
                    deleteGuestForApartment(selectedGuestId, selectedGuest)
                  );
                  closeModal();
                });
              }}
            >
              {t("delete")}
            </button>
          )}
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white p-2 rounded-md font-bold"
            onClick={async () => {
              if (checkForRequiredFields()) {
                if (selectedGuest && selectedGuestId) {
                  await dispatch(
                    deleteGuestForApartment(selectedGuestId, selectedGuest)
                  );
                }
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
