import { useState } from "react";
import { useTranslation } from "react-i18next";
import DateInput from "../../Inputs/DateInput";
import ImageInput from "../../Inputs/ImageInput";
import ServiceInput from "../../Inputs/ServiceInput";
import { TransactionReceiptData } from "../Receipt";

import style from "./ReceiptInputs.module.scss";

type Props = {
  receiptData: TransactionReceiptData;
  setReceiptData: (data: TransactionReceiptData) => void;
};

const ReceiptInputs = (props: Props) => {
  const { receiptData, setReceiptData } = props;

  const { t } = useTranslation("ReceiptInputs");

  const [displayInputSection, setDisplayInputSection] =
    useState("apartmentData");

  return (
    <div
      className={`flex gap-3 flex-col w-full xl:w-1/2`}
      style={{
        minHeight: window.innerHeight - 60 - window.innerHeight * 0.05 + "px",
      }}
    >
      {Object.keys(receiptData).map(key => {
        return (
          <div
            key={key}
            className={`${style.sections} ${
              displayInputSection === key && style.sections__show
            }`}
          >
            <h1
              className="text-2xl font-bold hover:cursor-pointer bg-zinc-200 text-gray-800 px-3 py-2 rounded-md hover:bg-zinc-100"
              onClick={() => {
                setDisplayInputSection(key);
              }}
            >
              {t(`${key}`)}
            </h1>
            <div
              className={`flex flex-col gap-3 ${style.section}`}
              ref={el => {
                if (el) {
                  if (displayInputSection === key) {
                    setTimeout(() => {
                      el.style.overflowY = "auto";
                    }, 250);
                  } else {
                    el.style.overflowY = "hidden";
                  }
                }
              }}
            >
              {Object.entries(
                receiptData[key as keyof TransactionReceiptData]
              ).map(([innerKey, value]) => {
                if (innerKey !== "image") {
                  if (innerKey !== "services") {
                    if (innerKey.includes("date")) {
                      return (
                        <div key={innerKey} className="flex flex-col">
                          <span className="font-bold">{t(`${innerKey}`)}</span>
                          <DateInput
                            value={value as string}
                            resetData={() => {
                              setReceiptData({
                                ...receiptData,
                                [key]: {
                                  ...receiptData[
                                    key as keyof typeof receiptData
                                  ],
                                  [innerKey]: "",
                                },
                              });
                            }}
                            setValue={date => {
                              setReceiptData({
                                ...receiptData,
                                [key]: {
                                  ...receiptData[
                                    key as keyof typeof receiptData
                                  ],
                                  [innerKey]: date,
                                },
                              });
                            }}
                          />
                        </div>
                      );
                    } else
                      return (
                        <div key={innerKey} className="flex flex-col">
                          <span className="font-bold">{t(innerKey)}</span>
                          {innerKey === "VAT" ? (
                            <input
                              className="h-6 focus:border-blue-500"
                              type={"checkbox"}
                              checked={value ? Boolean(value) : false}
                              onChange={e => {
                                setReceiptData({
                                  ...receiptData,
                                  receiptData: {
                                    ...receiptData["receiptData"],
                                    VAT: e.target.checked,
                                  },
                                });
                              }}
                            />
                          ) : (
                            <input
                              className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                              type={"text"}
                              value={value ? value.toString() : ""}
                              onChange={e => {
                                setReceiptData({
                                  ...receiptData,
                                  [key]: {
                                    ...receiptData[
                                      key as keyof typeof receiptData
                                    ],
                                    [innerKey]: e.target.value,
                                  },
                                });
                              }}
                            />
                          )}
                        </div>
                      );
                  } else {
                    return (
                      <div key={innerKey}>
                        <span className="font-bold">{t(innerKey)}</span>
                        <div className="flex flex-col">
                          {Object.entries(
                            receiptData["receiptData"]["services"]
                          ).map(([serviceKey, serviceValue]) => {
                            let newArray = [
                              ...receiptData["receiptData"]["services"],
                            ];

                            const handleServiceName = (value: string) => {
                              newArray[Number(serviceKey)].name = value;
                              newArray[Number(serviceKey)].total = (
                                Number(serviceValue.price) *
                                Number(serviceValue.amount)
                              ).toFixed(2);
                              setReceiptData({
                                ...receiptData,
                                [key]: {
                                  ...receiptData[
                                    key as keyof typeof receiptData
                                  ],
                                  services: newArray,
                                },
                              });
                            };

                            const handleServiceChange = (
                              value: string,
                              inputKey: "price" | "amount"
                            ) => {
                              newArray[Number(serviceKey)][inputKey] =
                                Number(value).toFixed(2);
                              newArray[Number(serviceKey)].total = (
                                Number(serviceValue.price) *
                                Number(serviceValue.amount)
                              ).toFixed(2);
                              setReceiptData({
                                ...receiptData,
                                [key]: {
                                  ...receiptData[
                                    key as keyof typeof receiptData
                                  ],
                                  services: newArray,
                                },
                              });
                            };

                            return (
                              <ServiceInput
                                key={serviceKey}
                                setServiceAmount={value =>
                                  handleServiceChange(value, "amount")
                                }
                                setServicePrice={value =>
                                  handleServiceChange(value, "price")
                                }
                                setServiceName={value =>
                                  handleServiceName(value)
                                }
                                removeService={() => {
                                  newArray.splice(Number(serviceKey), 1);
                                  setReceiptData({
                                    ...receiptData,
                                    [key]: {
                                      ...receiptData[
                                        key as keyof typeof receiptData
                                      ],
                                      services: newArray,
                                    },
                                  });
                                }}
                                serviceTotal={serviceValue.total}
                              />
                            );
                          })}
                        </div>
                        <button
                          className="appearance-none p-3 border rounded-md bg-white hover:bg-gray-100 text-gray-700 leading-tight"
                          onClick={() => {
                            setReceiptData({
                              ...receiptData,
                              [key]: {
                                ...receiptData[key as keyof typeof receiptData],
                                services: [
                                  ...receiptData["receiptData"]["services"],
                                  {
                                    name: "",
                                    amount: "",
                                    price: "",
                                    total: "",
                                  },
                                ],
                              },
                            });
                          }}
                        >
                          {t("add_new_service")}
                        </button>
                      </div>
                    );
                  }
                } else {
                  return (
                    <ImageInput
                      inputName={t(innerKey)}
                      image={receiptData.apartmentData.image}
                      setImage={image => {
                        setReceiptData({
                          ...receiptData,
                          apartmentData: {
                            ...receiptData.apartmentData,
                            image: image,
                          },
                        });
                      }}
                      clearImage={() => {
                        setReceiptData({
                          ...receiptData,
                          apartmentData: {
                            ...receiptData.apartmentData,
                            image: "",
                          },
                        });
                      }}
                    />
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReceiptInputs;
