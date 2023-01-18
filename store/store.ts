import { connectAuthEmulator, getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  connectFirestoreEmulator,
  getFirestore as GetFirestore,
} from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { reducers } from "./reducers/reducer";
import firebaseConfig from "./Config/fbConfig";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

if (process.env.NODE_ENV === "development") {
  // const db = GetFirestore();
  // connectFirestoreEmulator(db, "localhost", 8080);
  // const functions = getFunctions(firebase.app());
  // connectFunctionsEmulator(functions, "localhost", 5001);
  // const auth = getAuth();
  // connectAuthEmulator(auth, "http://localhost:9099");
  // const firebaseStorage = getStorage();
  // connectStorageEmulator(firebaseStorage, "localhost", 9199);
}

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    });

    return middleware;
  },
});
const persistor = persistStore(store);

export { store, persistor };

export type AppDispatch = typeof store.dispatch;
export type AppState = typeof store.getState;
