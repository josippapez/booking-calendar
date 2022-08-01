import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
// import { connectAuthEmulator, getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
// import { connectStorageEmulator, getStorage } from "firebase/storage";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import firebaseConfig from "../src/Config/fbConfig";
import { reducers, RootState } from "./reducers/reducer";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

firebase.initializeApp(firebaseConfig);

// const db = getFirestore();
// connectFirestoreEmulator(db, "localhost", 8080);
// const functions = getFunctions(firebase.app());
// connectFunctionsEmulator(functions, "localhost", 5001);
// const auth = getAuth();
// connectAuthEmulator(auth, "http://localhost:9099");
// const firebaseStorage = getStorage();
// connectStorageEmulator(firebaseStorage, "localhost", 9199);

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
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
