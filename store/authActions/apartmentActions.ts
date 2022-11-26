import axios from "axios";
import Cookies from "js-cookie";
import { removeApartmentById, setApartments } from "../reducers/apartments";
import { AppDispatch, AppGetState } from "../store";

let imageUrl: string | ArrayBuffer | null = null;

const getBase64 = async (
  file: File,
  setError: (error: ProgressEvent<FileReader>) => void
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => {
      setError(error);
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

const saveApartmentData = async (
  apartment: {
    id?: string;
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
    if (apartment.id) {
      return await dispatch(editExistingApartment(apartment, setProgress));
    } else {
      return await dispatch(createNewApartment(apartment, setProgress));
    }
  } else {
    if (apartment.id) {
      return await dispatch(editExistingApartment(apartment, setProgress));
    }
    return await dispatch(createNewApartment(apartment, setProgress));
  }
};

export const saveApartment = (
  apartment: {
    name: string;
    address: string;
    id?: string;
    email: string;
    image: File | string;
    pid?: string;
    iban?: string;
    owner?: string;
  },
  setProgress: (progress: number) => void,
  setError: (error: string) => void
) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    return await saveApartmentData(apartment, setProgress, setError, dispatch);
  };
};

export const removeApartment = (apartmentId: string) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    await axios
      .delete(`/apartments/${apartmentId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .then(res => {
        if (res.status === 200) {
          dispatch(removeApartmentById(apartmentId));
        } else {
          return;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const createNewApartment = (
  apartment: {
    id?: string;
    name: string;
    address: string;
    email: string;
    image: File | string;
    iban?: string;
    pid?: string;
    owner?: string;
  },
  setProgress: (progress: number) => void
) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    if (typeof apartment.image !== "string") {
      const result = await getBase64(apartment.image, error => {
        console.log(error, "error upload");
        // setError(error);
      });
      imageUrl = (result as string).toString();
    }

    return await axios
      .post(
        `/apartments`,
        {
          ...apartment,
          image: imageUrl,
          userId: getState().user.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          onUploadProgress: progressEvent => {
            setProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        }
      )
      .then(res => {
        dispatch(
          setApartments([...getState().apartments.apartments, res.data])
        );
        setProgress(0);
        return res;
      });
  };
};

const editExistingApartment = (
  apartment: {
    id?: string;
    name: string;
    address: string;
    email: string;
    image: File | string;
    iban?: string;
    pid?: string;
    owner?: string;
  },
  setProgress: (progress: number) => void
) => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    imageUrl = apartment.image as string;
    if (typeof apartment.image !== "string" && apartment.image) {
      const result = await getBase64(apartment.image, error => {
        console.log(error, "error upload");
        // setError(error);
      });
      imageUrl = (result as string).toString();
    }

    return await axios
      .patch(
        `/apartments/${apartment.id}`,
        {
          ...apartment,
          image: imageUrl,
          userId: getState().user.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          onUploadProgress: progressEvent => {
            setProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        }
      )
      .then(res => {
        const tempApartments = [...getState().apartments.apartments];
        const index = tempApartments.findIndex(
          apartment => apartment.id === res.data.id
        );
        tempApartments[index] = res.data;
        dispatch(setApartments(tempApartments));
        setProgress(0);
        return res;
      });
  };
};
