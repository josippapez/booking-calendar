import { combineReducers } from "@reduxjs/toolkit";
import apartments from "./apartments";
import events from "./events";
import guests from "./guests";
import user from "./user";

export const reducers = combineReducers({
  events,
  apartments,
  user,
  guests,
});
