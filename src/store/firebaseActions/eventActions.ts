import firebase from 'firebase/compat/app';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { Event } from '../../Components/Calendar/CalendarTypes';
import { setEvents } from '../reducers/events';
import { AppDispatch, AppState } from './../store';

export const saveEventsForApartment = (events: { [key: string]: Event[] }) => {
  return (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;

    dispatch(setEvents(events));
    if (selectedApartment && selectedApartment.id) {
      setDoc(
        doc(getFirestore(firebase.app()), 'events', selectedApartment.id),
        events
      );
    }
  };
};

export const removeEventForApartment = (eventId: string) => {
  return (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    const events = getState().events.events;

    const tempEvents = {} as { [key: string]: Event[] };
    Object.keys(events).map(key => {
      const filtered = events[key].filter(event => event.id !== eventId);
      if (filtered.length > 0) {
        tempEvents[key] = filtered;
      }
    });

    dispatch(setEvents(tempEvents));

    if (selectedApartment && selectedApartment.id) {
      setDoc(
        doc(getFirestore(firebase.app()), 'events', selectedApartment.id),
        tempEvents
      );
    }
  };
};
