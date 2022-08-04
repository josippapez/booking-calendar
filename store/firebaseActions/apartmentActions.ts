import firebase from "firebase/compat/app";
import { deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  listAll,
  deleteObject,
} from "firebase/storage";
import {
  Apartment,
  selectApartment,
  setApartments,
} from "../reducers/apartments";
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
  const storage = getStorage();
  const storageRef = ref(storage, `apartments/${apartment.name}`);

  listAll(storageRef).then((files: any) => {
    files.items.forEach(async (fileRef: any) => {
      await deleteObject(ref(storage, fileRef.fullPath));
    });
  });

  if (typeof apartment.image === "string") {
    dispatch(setApartmentDataTofirebase(apartment, apartment.image));
  } else {
    const metadata = {
      contentType: apartment.image.type,
    };
    const storage = getStorage();
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
    deleteDoc(doc(getFirestore(firebase.app()), "events", apartmentId));
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
    const tempApartments = {
      ...getState().apartments.apartments,
      [apartment.id]: { ...apartment, image: imageUrl },
    };

    dispatch(selectApartment({ ...apartment, image: imageUrl }));
    dispatch(setApartments(tempApartments));
    setDoc(
      doc(getFirestore(firebase.app()), "apartments", getState().user.user.id),
      tempApartments
    );

    setDoc(doc(getFirestore(firebase.app()), "events", apartment.id), {
      userId: getState().user.user.id,
      apartmentName: apartment.name,
    });
  };
};
