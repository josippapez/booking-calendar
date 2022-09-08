import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AddNewGuest from "./GuestsModal/AddNewGuest";

type Props = {};

const Guests = (props: Props) => {
  const { t } = useTranslation("AddNewGuest");
  const [showAddNewGuestModal, setShowAddNewGuestModal] = useState(false);
  return (
    <div>
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
          closeModal={setShowAddNewGuestModal}
        />
      )}
    </div>
  );
};

export default Guests;
