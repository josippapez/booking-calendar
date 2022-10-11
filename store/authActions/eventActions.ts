import axios from "axios";
import { Event } from "../../src/components/Calendar/CalendarTypes";
import { setEvents } from "../reducers/events";
import { AppDispatch, AppState } from "../store";

export const saveEventsForApartment = (event: Event) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    return await axios
      .post(`/events/${selectedApartment?.id}`, event)
      .then(res => {
        dispatch(setEvents(res.data.data));
        return res;
      })
      .catch(err => {
        return err;
      });
  };
};

export const editEventForApartment = (event: Event, eventToEdit: Event) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    return await axios
      .patch(`/events/${selectedApartment?.id}`, {
        updatedEvent: event,
        oldEvent: eventToEdit,
      })
      .then(res => {
        dispatch(setEvents(res.data.data));
        return res;
      })
      .catch(err => {
        return err;
      });
  };
};

export const removeEventForApartment = (event: Event) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    return await axios
      .patch(`/events/${selectedApartment?.id}/${event.id}`, event)
      .then(res => {
        dispatch(setEvents(res.data.data ?? {}));
        return res;
      })
      .catch(err => {
        return err;
      });
  };
};
