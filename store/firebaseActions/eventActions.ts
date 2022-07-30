import firebase from "firebase/compat/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Event } from "../../src/components/Calendar/CalendarTypes";
import { setEvents } from "../reducers/events";
import { AppDispatch, AppState } from "./../store";

export const saveEventsForApartment = (events: {
  [key: string]: { [key: string]: Event[] };
}) => {
  return (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;

    dispatch(setEvents(events));
    if (selectedApartment && selectedApartment.id) {
      const privateEventData: {
        [key: string]: { [key: string]: { start: string; end: string }[] };
      } = {};
      Object.keys(events).map(key => {
        privateEventData[key] = {};
        Object.keys(events[key]).map(eventKey => {
          const tempEvents: { start: string; end: string }[] = [];
          events[key][eventKey].forEach(event => {
            tempEvents.push({ start: event.start, end: event.end });
          });
          privateEventData[key][eventKey] = tempEvents;
        });
      });

      setDoc(
        doc(
          getFirestore(firebase.app()),
          `events/${selectedApartment.id}/data`,
          "private"
        ),
        events
      );
      setDoc(
        doc(
          getFirestore(firebase.app()),
          `events/${selectedApartment.id}/data`,
          "public"
        ),
        privateEventData
      );
    }
  };
};

export const removeEventForApartment = (eventId: string) => {
  return (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    const events = getState().events.events;

    const removedEvents = {} as { [key: string]: { [key: string]: Event[] } };
    Object.keys(events).map(key => {
      removedEvents[key] = {};
      Object.keys(events[key]).map(eventKey => {
        const filtered = events[key][eventKey].filter(
          event => event.id !== eventId
        );
        if (filtered.length > 0) {
          removedEvents[key][eventKey] = filtered;
        }
      });
    });

    const privateEventData: {
      [key: string]: { [key: string]: { start: string; end: string }[] };
    } = {};
    Object.keys(removedEvents).map(key => {
      privateEventData[key] = {};
      Object.keys(removedEvents[key]).map(eventKey => {
        const tempEvents: { start: string; end: string }[] = [];
        removedEvents[key][eventKey].forEach(event => {
          tempEvents.push({ start: event.start, end: event.end });
        });
        privateEventData[key][eventKey] = tempEvents;
      });
    });

    dispatch(setEvents(removedEvents));

    if (selectedApartment && selectedApartment.id) {
      setDoc(
        doc(
          getFirestore(firebase.app()),
          `events/${selectedApartment.id}/data`,
          "private"
        ),
        removedEvents
      );
      setDoc(
        doc(
          getFirestore(firebase.app()),
          `events/${selectedApartment.id}/data`,
          "public"
        ),
        privateEventData
      );
    }
  };
};
