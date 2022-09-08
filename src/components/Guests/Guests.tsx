import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectApartment } from "../../../store/reducers/apartments";
import Dropdown from "../Shared/Dropdown/Dropdown";
import AddNewGuest from "./GuestsModal/AddNewGuest";

type Props = {};

const Guests = (props: Props) => {
  const { t } = useTranslation("Guests");
  const dispatch = useAppDispatch();
  const apartments = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );
  const [showAddNewGuestModal, setShowAddNewGuestModal] = useState(false);
  return (
    <div>
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
      <div className="flex justify-between">
        <h1>{t("guest_book")}</h1>
        <button
          onClick={() => setShowAddNewGuestModal(true)}
          className="bg-blue-700 hover:bg-blue-500 text-white p-2 rounded-md font-bold hover:"
        >
          {t("add_new_guest")}
        </button>
      </div>
      {showAddNewGuestModal && (
        <AddNewGuest
          show={showAddNewGuestModal}
          closeModal={() => setShowAddNewGuestModal(false)}
        />
      )}
    </div>
  );
};

export default Guests;
