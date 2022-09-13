import firebase from "firebase/compat/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import isEqual from "lodash/fp/isEqual";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  editApartment,
  removeApartment,
  saveApartment,
} from "../../../../store/firebaseActions/apartmentActions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  Apartment,
  selectApartment,
  setApartments,
} from "../../../../store/reducers/apartments";
import { setEvents } from "../../../../store/reducers/events";
import useMobileView from "../../../checkForMobileView";

type Props = {};

const Apartments: NextPage = (props: Props) => {
  const { t } = useTranslation("Apartments");
  const dispatch = useAppDispatch();
  const mobileView = useMobileView();
  const navigate = useRouter();
  const user = useAppSelector(state => state.user.user);
  const apartments = useAppSelector(state => state.apartments);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<null | string>(null);
  const [newApartment, setNewApartment] = useState<{
    name: string;
    address: string;
    id: string;
    email: string;
    image: File | string;
    pid: string;
    iban: string;
    owner: string;
  }>({
    id: "",
    name: "",
    address: "",
    email: "",
    image: "",
    pid: "",
    iban: "",
    owner: "",
  });
  const emailRegex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  const getApartmentsForuser = async (id: string) => {
    const apartmentsData = await getDoc(
      doc(getFirestore(firebase.app()), "apartments", `${id}`)
    );

    if (!isEqual(apartmentsData.data(), apartments.apartments)) {
      dispatch(
        setApartments(
          apartmentsData.data() as {
            [key: string]: {
              id: string;
              name: string;
              address: string;
              email: string;
              image: string;
              pid: string;
              iban: string;
              owner: string;
            };
          }
        )
      );
    }
  };

  useEffect(() => {
    getApartmentsForuser(user.id);
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-between">
          <div className="font-bold text-3xl">{t("apartments")}</div>
        </div>
        <div
          className={`flex ${
            mobileView ? "flex-col" : "gap-10"
          } drop-shadow-sm`}
        >
          <div
            className={`w-full ${mobileView ? "100%" : "max-w-sm"}
            mt-6 mb-8`}
          >
            <form className="rounded-md relative">
              {newApartment.id && (
                <div
                  className={`absolute right-0 -top-4 w-8 h-8 font-black text-3xl rounded-full cursor-pointer text-center bg-transparent`}
                  style={{
                    backgroundImage: `url(/Styles/Assets/Images/xCircle.svg)`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                  }}
                  onClick={() => {
                    setNewApartment({
                      id: "",
                      name: "",
                      address: "",
                      email: "",
                      image: "",
                      pid: "",
                      iban: "",
                      owner: "",
                    });
                  }}
                />
              )}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="apartmentName"
                >
                  {t("apartment_name")}
                </label>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  id="apartmentName"
                  type="text"
                  value={newApartment.name}
                  onChange={e => {
                    setNewApartment({ ...newApartment, name: e.target.value });
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="apartmentAddress"
                >
                  {t("apartment_address")}
                </label>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  id="apartmentAddress"
                  type="text"
                  value={newApartment.address}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      address: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="apartmentOwner"
                >
                  {t("apartment_owner")}
                </label>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  id="apartmentOwner"
                  type="text"
                  value={newApartment.owner}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      owner: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="apartmentPID"
                >
                  {t("apartment_pid")}
                </label>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  id="apartmentPID"
                  type="text"
                  value={newApartment.pid}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      pid: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="apartmentIBAN"
                >
                  {t("apartment_IBAN")}
                </label>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  id="apartmentIBAN"
                  type="text"
                  value={newApartment.iban}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      iban: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="appartmentEmail"
                >
                  {t("apartment_email")}
                </label>
                <input
                  className={`appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500 mb-3  ${
                    newApartment.email
                      ? emailRegex.test(newApartment.email)
                        ? "!border-green-500"
                        : "!border-red-500"
                      : ""
                  }`}
                  id="appartmentEmail"
                  type="text"
                  value={newApartment.email}
                  onChange={e => {
                    setNewApartment({
                      ...newApartment,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  disabled={
                    !newApartment.address ||
                    !newApartment.name ||
                    !emailRegex.test(newApartment.email)
                  }
                  className="bg-blue-700 hover:bg-blue-500 text-white shadow-md font-bold py-2 px-4 rounded disabled:bg-gray-400"
                  type="button"
                  onClick={() => {
                    if (
                      newApartment.address &&
                      newApartment.name &&
                      emailRegex.test(newApartment.email)
                    ) {
                      if (newApartment.id) {
                        dispatch(
                          editApartment(newApartment, setProgress, setError)
                        );
                        setNewApartment({
                          id: "",
                          name: "",
                          address: "",
                          email: "",
                          image: "",
                          pid: "",
                          iban: "",
                          owner: "",
                        });
                        return;
                      }
                      dispatch(
                        saveApartment(
                          {
                            ...newApartment,
                            id: crypto
                              .getRandomValues(new Uint8Array(16))
                              .join(""),
                          },
                          setProgress,
                          setError
                        )
                      );
                      setNewApartment({
                        id: "",
                        name: "",
                        address: "",
                        email: "",
                        image: "",
                        pid: "",
                        iban: "",
                        owner: "",
                      });
                    }
                  }}
                >
                  {newApartment && newApartment.id
                    ? t("edit_apartment")
                    : t("add_apartment")}
                </button>
              </div>
            </form>
          </div>
          <div className={`w-full max-w-md mt-6 mb-8`}>
            {progress ? (
              <div className="flex justify-center bg-gray-200 rounded-md shadow-md w-full">
                <div
                  className="bg-blue-500 rounded-md shadow-md"
                  style={{
                    width: `${progress}%`,
                    height: "2px",
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between gap-4">
                {newApartment.image && newApartment.image !== "" && (
                  <div
                    className={`flex justify-center relative ${
                      mobileView ? "h-[17rem]" : "h-full"
                    }`}
                  >
                    <Image
                      src={
                        typeof newApartment.image === "string"
                          ? newApartment.image
                          : URL.createObjectURL(newApartment.image)
                      }
                      objectFit="contain"
                      alt="apartment Logo"
                      layout="fill"
                      placeholder="empty"
                    />
                  </div>
                )}
                <div className="flex justify-between">
                  <div>
                    {error && (
                      <div className="text-red-500 font-bold">{error}</div>
                    )}
                    <label
                      className="block cursor-pointer h-10 py-2 px-4 text-gray-700 font-bold w-fit rounded-md hover:bg-blue-500 hover:drop-shadow-md hover:text-white"
                      htmlFor="apartmentImage"
                    >
                      {t("apartment_image")}
                    </label>
                    <input
                      className="hidden"
                      id="apartmentImage"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onClick={e => {
                        setError(null);
                      }}
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          if (
                            parseInt(
                              (e.target.files[0].size / (1024 * 1024)).toFixed(
                                2
                              )
                            ) < 2
                          ) {
                            setNewApartment({
                              ...newApartment,
                              image: e.target.files[0],
                            });
                          } else {
                            setError(t("image_size_error", { size: 2 }));
                          }
                        }
                      }}
                    />
                  </div>
                  {newApartment.image && newApartment.image !== "" && (
                    <div>
                      <button
                        className="bg-blue-700 hover:bg-blue-500 text-white shadow-md font-bold py-2 px-4 rounded"
                        type="button"
                        onClick={() => {
                          setNewApartment({
                            ...newApartment,
                            image: "",
                          });
                        }}
                      >
                        {t("clear")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`relative overflow-x-auto drop-shadow-md rounded-lg ${
          mobileView && "full-bleed"
        }`}
      >
        <table className="w-full text-left text-gray-500 dark:text-gray-400 text-base">
          <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-md">
                {t("name")}
              </th>
              <th scope="col" className="px-6 py-3 text-md">
                {t("address")}
              </th>
              <th scope="col" className="px-6 py-3 text-md">
                {t("email")}
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">{t("edit")}</span>
                <span className="sr-only">{t("remove")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {apartments &&
              apartments?.apartments &&
              Object.keys(apartments.apartments).map(apartment => (
                <tr
                  className="bg-white border-b cursor-pointer hover:bg-blue-50 hover:transition-colors duration-150 first:rounded-t-lg"
                  key={apartments.apartments[apartment].id}
                  onClick={() => {
                    if (
                      apartments.selectedApartment?.id !==
                      apartments.apartments[apartment].id
                    ) {
                      dispatch(setEvents({}));
                    }
                    dispatch(selectApartment(apartments.apartments[apartment]));
                    navigate.push(
                      `/apartments/${apartments.apartments[apartment].id}`
                    );
                  }}
                >
                  <td className="font-bold px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">
                    {apartments.apartments[apartment].name}
                  </td>
                  <td className="font-bold px-6 py-4">
                    {apartments.apartments[apartment].address}
                  </td>
                  <td className="font-bold px-6 py-4">
                    {apartments.apartments[apartment].email}
                  </td>
                  <td
                    className={`px-6 py-4 text-right ${
                      mobileView ? "flex" : ""
                    }`}
                  >
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={e => {
                        e.stopPropagation();
                        dispatch(
                          removeApartment(apartments.apartments[apartment].id)
                        );
                      }}
                    >
                      {t("remove")}
                    </button>
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-4"
                      onClick={e => {
                        e.stopPropagation();
                        setNewApartment({
                          pid: apartments.apartments[apartment]?.pid || "",
                          iban: apartments.apartments[apartment]?.iban || "",
                          owner: apartments.apartments[apartment]?.owner || "",
                          ...apartments.apartments[apartment],
                        });
                      }}
                    >
                      {t("edit")}
                    </button>
                    {!mobileView && (
                      <Link
                        key={apartments.apartments[apartment].id}
                        href={`/apartments/${apartments.apartments[apartment].id}`}
                      >
                        <a
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline ml-4"
                          onClick={() => {
                            if (
                              apartments.selectedApartment?.id !==
                              apartments.apartments[apartment].id
                            ) {
                              dispatch(setEvents({}));
                            }
                            dispatch(
                              selectApartment(apartments.apartments[apartment])
                            );
                          }}
                        >
                          {t("select")}
                        </a>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Apartments;
