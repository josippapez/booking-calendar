import { FirebaseError } from "firebase/app";
import firebase from "firebase/compat/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { DateTime, Info } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectApartment } from "../../../store/reducers/apartments";
import { setGuests } from "../../../store/reducers/guests";
import Dropdown from "../Shared/Dropdown/Dropdown";
import AddNewGuest from "./GuestsModal/AddNewGuest";

type Props = {};

const Guests = (props: Props) => {
  const { t, i18n } = useTranslation("Guests");
  const navigate = useRouter();
  const dispatch = useAppDispatch();
  const apartments = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );
  const guests = useAppSelector(state => state.guests.guests);

  const [selectedMonth, setSelectedMonth] = useState<null | number>(null);
  const [showAddNewGuestModal, setShowAddNewGuestModal] = useState(false);

  const getGuestsForApartment = async (id: string) => {
    try {
      const guestsForAppartment = await getDoc(
        doc(
          getFirestore(firebase.app()),
          `guests/${id}/data`,
          DateTime.local().year.toString()
        )
      ).then(doc => {
        if (doc.exists()) {
          return doc.data();
        } else {
          return {};
        }
      });

      dispatch(setGuests(guestsForAppartment));
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "permission-denied") {
          navigate.push("/");
        }
      }
    }
  };

  useEffect(() => {
    if (selectedApartment?.id) {
      getGuestsForApartment(selectedApartment.id);
    }
  }, [selectedApartment]);

  return (
    <>
      <h1 className="font-bold text-3xl">{t("guest_book")}</h1>
      {selectedApartment && (
        <>
          <div className="flex justify-between items-center mt-7 mb-10">
            <Dropdown
              placeholder="Select apartment"
              data={Object.keys(apartments?.apartments).map(key => {
                return {
                  id: apartments.apartments[key].id,
                  name: apartments.apartments[key].name,
                  value: apartments.apartments[key],
                };
              })}
              selected={selectedApartment?.id as string}
              setData={item => {
                if (item !== (selectedApartment?.id as string)) {
                  dispatch(selectApartment(apartments.apartments[item]));
                }
              }}
            />
            <button
              onClick={() => setShowAddNewGuestModal(true)}
              className="bg-blue-700 hover:bg-blue-500 text-white p-2 rounded-md font-bold hover:"
            >
              {t("add_new_guest")}
            </button>
          </div>
          {Object.keys(guests)
            .sort((a, b) => (Number(a) > Number(b) ? -1 : 1))
            .map(key => {
              return (
                <div key={key}>
                  <h1
                    className={`font-extrabold text-3xl drop-shadow-md mb-3 cursor-pointer hover:bg-neutral-300 ${
                      selectedMonth === parseInt(key) && "bg-neutral-200"
                    } py-3 px-4 rounded-md`}
                    onClick={() => {
                      if (selectedMonth === parseInt(key)) {
                        setSelectedMonth(null);
                      } else {
                        setSelectedMonth(parseInt(key));
                      }
                    }}
                  >
                    {
                      Info.months("long", { locale: i18n.language })[
                        Number(key) - 1
                      ]
                    }
                  </h1>
                  {selectedMonth === parseInt(key) && (
                    <table className="w-full">
                      <thead className="text-left text-lg drop-shadow-md">
                        <tr className="h-16">
                          <th className="font-semibold">{t("name")}</th>
                          <th className="font-semibold">{t("PID")}</th>
                          <th className="font-semibold">{t("dateOfBirth")}</th>
                          <th className="font-semibold">{t("country")}</th>
                          <th className="font-semibold">{t("address")}</th>
                          <th className="font-semibold">
                            {t("dateOfArrival")}
                          </th>
                          <th className="font-semibold">
                            {t("dateOfDeparture")}
                          </th>
                          <th className="font-semibold">
                            {t("numberOfReceipt")}
                          </th>
                          <th className="font-semibold">{t("note")}</th>
                        </tr>
                      </thead>
                      <tbody className="text-lg">
                        {Object.entries(guests[key])
                          .sort(
                            (
                              [firstKey, firstValue],
                              [secondKey, secondValue]
                            ) =>
                              secondValue.dateOfArrival >
                              firstValue.dateOfArrival
                                ? 1
                                : -1
                          )
                          .map(([key, value]) => {
                            return (
                              <tr key={key} className="h-16">
                                <td className="font-medium">{value.name}</td>
                                <td>{value.PID}</td>
                                <td>
                                  {DateTime.fromISO(value.dateOfBirth)
                                    .setLocale(i18n.language)
                                    .toLocaleString({
                                      month: "long",
                                      day: "2-digit",
                                      year: "numeric",
                                    })}
                                </td>
                                <td>{value.country}</td>
                                <td>{value.address}</td>
                                <td>
                                  {DateTime.fromISO(value.dateOfArrival)
                                    .setLocale(i18n.language)
                                    .toLocaleString({
                                      month: "long",
                                      day: "2-digit",
                                      year: "numeric",
                                    })}
                                </td>
                                <td>
                                  {DateTime.fromISO(value.dateOfDeparture)
                                    .setLocale(i18n.language)
                                    .toLocaleString({
                                      month: "long",
                                      day: "2-digit",
                                      year: "numeric",
                                    })}
                                </td>
                                <td>{value.numberOfReceipt}</td>
                                <td>{value.note}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
        </>
      )}
      {showAddNewGuestModal && (
        <AddNewGuest
          show={showAddNewGuestModal}
          closeModal={() => setShowAddNewGuestModal(false)}
        />
      )}
    </>
  );
};

export default Guests;
