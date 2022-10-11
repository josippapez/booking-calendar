import axios from "axios";
import { Guest } from "../../src/components/Guests/GuestsModal/AddNewGuest";
import { AppDispatch, AppState } from "../store";

export const saveGuestForApartment = (
  guest: Guest,
  oldGuest: Guest | undefined
) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    return await axios
      .post(`/guests/${selectedApartment?.id}`, {
        newGuestInfo: guest,
        oldGuestInfo: oldGuest,
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  };
};

export const deleteGuestForApartment = (guestId: string, guest: Guest) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    return await axios
      .patch(`/guests/${selectedApartment?.id}`, {
        id: guestId,
        ...guest,
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err;
      });
  };
};
