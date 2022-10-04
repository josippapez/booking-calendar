import axios from "axios";
import { DateTime, Info } from "luxon";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Images from "../../../public/Styles/Assets/Images/Images";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Apartment, selectApartment } from "../../../store/reducers/apartments";
import { setGuests } from "../../../store/reducers/guests";
import DatePickerHeader from "../Shared/DatePicker/Header/DatePickerHeader";
import Dropdown from "../Shared/Dropdown/Dropdown";
import AddNewGuest, { Guest } from "./GuestsModal/AddNewGuest";

type Props = {};

const Guests = (props: Props) => {
  const { t, i18n } = useTranslation("Guests");
  const dispatch = useAppDispatch();
  const apartments = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );
  const guests = useAppSelector(state => state.guests.guests);

  const [selectedMonth, setSelectedMonth] = useState<null | number>(null);
  const [showAddNewGuestModal, setShowAddNewGuestModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    DateTime.local().year
  );
  const [sorting, setSorting] = useState<string>("desc");
  const [selectedGuest, setSelectedGuest] = useState<null | Guest>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string>("");

  const getGuestsForApartment = async (id: string) => {
    const guests = await axios
      .get(`/guests/${id}/${selectedYear}`)
      .then(res => {
        if (res.data.data && res.data.data[selectedYear]) {
          return res.data.data[selectedYear];
        } else {
          return {};
        }
      })
      .catch(err => {
        return {};
      });
    dispatch(setGuests(guests));
  };

  useEffect(() => {
    if (selectedApartment?.id) {
      getGuestsForApartment(selectedApartment.id);
    }
  }, [selectedApartment, selectedYear]);

  return (
    <>
      <h1 className="font-bold text-3xl">{t("guest_book")}</h1>
      <>
        <div className="flex justify-between items-center mt-7 mb-10">
          <Dropdown
            placeholder="Select apartment"
            data={apartments?.apartments.map(apartment => {
              return {
                id: apartment.id,
                name: apartment.name,
                value: apartment,
              };
            })}
            selected={selectedApartment?.id as string}
            setData={item => {
              if (item.id !== (selectedApartment?.id as string)) {
                dispatch(selectApartment(item.value as Apartment));
              }
            }}
          />
          {selectedApartment && (
            <button
              onClick={() => setShowAddNewGuestModal(true)}
              className="bg-blue-700 hover:bg-blue-500 text-white p-2 rounded-md font-bold hover:"
            >
              {t("add_new_guest")}
            </button>
          )}
        </div>
        {selectedApartment && (
          <>
            <div className="flex mb-5 gap-4">
              <button
                className="flex justify-center items-center hover:bg-stone-200 drop-shadow-md rounded-md font-semibold px-3 text-xl gap-3"
                onClick={() => {
                  if (sorting === "desc") {
                    return setSorting("asc");
                  }
                  setSorting("desc");
                }}
              >
                {t("sorting")}
                <Image
                  src={Images.DownArrow}
                  alt="arrow"
                  height={25}
                  width={25}
                  className={`${sorting === "asc" ? "rotate-180" : ""}`}
                />
              </button>
              <DatePickerHeader
                hideMonth
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            </div>
            {guests &&
              Object.keys(guests)
                .sort((a, b) =>
                  Number(a) > Number(b)
                    ? sorting === "asc"
                      ? -1
                      : 1
                    : sorting === "asc"
                    ? 1
                    : -1
                )
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
                        <div
                          className={`relative overflow-x-auto drop-shadow-md`}
                        >
                          <table className="w-full whitespace-nowrap border-separate border-spacing-x-4">
                            <thead className="text-left text-lg">
                              <tr className="h-16">
                                <th className="font-semibold">{t("name")}</th>
                                <th className="font-semibold">{t("PID")}</th>
                                <th className="font-semibold">
                                  {t("dateOfBirth")}
                                </th>
                                <th className="font-semibold">
                                  {t("country")}
                                </th>
                                <th className="font-semibold">
                                  {t("address")}
                                </th>
                                <th className="font-semibold">
                                  {t("dateOfArrival")}
                                </th>
                                <th className="font-semibold">
                                  {t("dateOfDeparture")}
                                </th>
                                <th className="font-semibold">
                                  {t("numberOfInvoice")}
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
                                    <tr
                                      key={key}
                                      className="h-16 hover:cursor-pointer"
                                      onClick={() => {
                                        setSelectedGuestId(key);
                                        setSelectedGuest(value);
                                        setShowAddNewGuestModal(true);
                                      }}
                                    >
                                      <td className="font-medium">
                                        {value.name}
                                      </td>
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
                                      <td>{value.numberOfInvoice}</td>
                                      <td>{value.note}</td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
          </>
        )}
      </>
      {showAddNewGuestModal && (
        <AddNewGuest
          selectedGuest={selectedGuest || undefined}
          selectedGuestId={selectedGuestId}
          show={showAddNewGuestModal}
          closeModal={() => {
            setShowAddNewGuestModal(false);
            setSelectedGuest(null);
          }}
        />
      )}
    </>
  );
};

export default Guests;
