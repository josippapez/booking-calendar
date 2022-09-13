import firebase from "firebase/compat/app";
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from "firebase/remote-config";
import { DateTime } from "luxon";
import { AppDispatch, AppState } from "./../store";

export const sendEmail = (
  reservation: {
    id: string;
    title: string;
    phone: string;
    start: string;
    end: string;
  },
  email: string
) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const remoteConfig = getRemoteConfig(firebase.app());
    await fetchAndActivate(remoteConfig);
    const sendgrid_key = getValue(remoteConfig, "sendgrid_key").asString();

    fetch("api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg: {
          to: email,
          from: "booking.calendar.os.app@gmail.com",
          subject: "New reservation !!!!",
          dynamic_template_data: {
            start_date: DateTime.fromISO(reservation.start).toLocaleString(
              DateTime.DATE_HUGE
            ),
            end_date: DateTime.fromISO(reservation.end).toLocaleString(
              DateTime.DATE_HUGE
            ),
            reservation_name: reservation.title,
            reservation_phone: reservation.phone,
          },
        },
        sendgrid_key,
      }),
    }).then(res => {
      return res;
    });
  };
};
