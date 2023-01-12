import firebase from "firebase/compat/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { t } from "i18next";
import { toast } from "react-toastify";
import { selectApartment, setApartments } from "../reducers/apartments";
import { FirebaseCollectionActions } from "./../../src/Hooks/FirebaseCollectionActions";
import { AppDispatch, AppState } from "./../store";

let imageUrl = "";

const saveApartmentData = async (
  apartment: {
    id: string;
    image: string | File;
    name: string;
    address: string;
    email: string;
    iban?: string;
    pid?: string;
    owner?: string;
  },
  setProgress: (progress: number) => void,
  setError: (error: string) => void,
  dispatch: AppDispatch
) => {
  if (typeof apartment.image === "string") {
    dispatch(setApartmentDataTofirebase(apartment, apartment.image));
  } else {
    const metadata = {
      contentType: apartment.image.type,
    };
    const storage = getStorage();
    const storageRefExisting = ref(storage, `apartments/${apartment.name}`);

    await listAll(storageRefExisting).then((files: any) => {
      files.items.forEach(async (fileRef: any) => {
        await deleteObject(ref(storage, fileRef.fullPath));
      });
    });

    const storageRef = ref(
      storage,
      `apartments/${apartment.name}/${apartment.image.name}`
    );
    const uploadTask = uploadBytesResumable(
      storageRef,
      apartment.image,
      metadata
    );

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        switch (snapshot.state) {
          case "paused":
            break;
          case "running":
            break;
        }
      },
      error => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        setProgress(0);
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      async () => {
        setProgress(0);
        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
        dispatch(setApartmentDataTofirebase(apartment, imageUrl));
      }
    );
  }
};

export const saveApartment = (
  apartment: {
    name: string;
    address: string;
    id: string;
    email: string;
    image: File | string;
    pid?: string;
    iban?: string;
    owner?: string;
  },
  setProgress: (progress: number) => void,
  setError: (error: string) => void
) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    await saveApartmentData(apartment, setProgress, setError, dispatch);
  };
};

export const editApartment = (
  apartment: {
    name: string;
    address: string;
    id: string;
    email: string;
    image: File | string;
    pid?: string;
    iban?: string;
    owner?: string;
  },
  setProgress: (progress: number) => void,
  setError: (error: string) => void
) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    await saveApartmentData(apartment, setProgress, setError, dispatch);
  };
};

export const removeApartment = (apartmentId: string) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const { deleteById } = FirebaseCollectionActions("events");

    const tempApartments = { ...getState().apartments.apartments };
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `apartments/${tempApartments[apartmentId].name}`
    );
    delete tempApartments[apartmentId];

    listAll(storageRef).then((files: any) => {
      files.items.forEach(async (fileRef: any) => {
        await deleteObject(ref(storage, fileRef.fullPath));
      });
    });
    dispatch(setApartments(tempApartments));
    dispatch(selectApartment(null));
    deleteById(apartmentId, () => {
      const removedString = t("removed_apartment", {
        ns: "FirebaseActions",
      });
      toast(removedString, { type: "success", position: "bottom-right" });
    });
    setDoc(
      doc(getFirestore(firebase.app()), "apartments", getState().user.user.id),
      tempApartments
    );
  };
};

const setApartmentDataTofirebase = (
  apartment: {
    id: string;
    name: string;
    address: string;
    email: string;
    image: File | string;
    iban?: string;
    pid?: string;
    owner?: string;
  },
  imageUrl: string
) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const { addByUserId: addByIdApartments } =
      FirebaseCollectionActions("apartments");
    const { addByCustomId: addByIdGuests } =
      FirebaseCollectionActions("guests");
    const { addByCustomId: addByIdEvents } =
      FirebaseCollectionActions("events");

    const tempApartments = {
      ...getState().apartments.apartments,
      [apartment.id]: { ...apartment, image: imageUrl },
    };

    dispatch(selectApartment({ ...apartment, image: imageUrl }));
    dispatch(setApartments(tempApartments));

    dispatch(
      addByIdApartments(tempApartments, () => {
        const savedAparmtent = t("saved_apartment_data", {
          ns: "FirebaseActions",
        });
        toast(savedAparmtent, { type: "success", position: "bottom-right" });
      })
    );
    dispatch(
      addByIdGuests(apartment.id, {
        userId: getState().user.user.id,
      })
    );
    dispatch(
      addByIdEvents(apartment.id, {
        userId: getState().user.user.id,
        apartmentName: apartment.name,
      })
    );
  };
};
