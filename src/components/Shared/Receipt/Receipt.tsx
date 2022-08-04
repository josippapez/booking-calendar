import { usePDF } from "@react-pdf/renderer";
import { NextPage } from "next";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectApartment } from "../../../../store/reducers/apartments";
import useMobileView from "../../../checkForMobileView";
import Dropdown from "../Dropdown/Dropdown";
import PageLoader from "../Loader/PageLoader";
import PDFDownload from "../PDFDownload/PDFDownload";
import style from "./Receipt.module.scss";
import ReceiptTemplate from "./Templates/ReceiptTemplate";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Props = {};

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

const Receipt: NextPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("Receipt");
  const mobileView = useMobileView();

  const apartments = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );

  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayDownloadModal, setDisplayDownloadModal] =
    useState<boolean>(false);
  const [displayInputSection, setDisplayInputSection] =
    useState("apartmentData");
  const [transactionReceiptData, setTransactionReceiptData] = useState<{
    apartmentData: {
      name: string;
      address: string;
      owner: string;
      image: string;
      pid: string;
      iban: string;
    };
    recepientData: {
      recepientName: string;
      recepientAddress: string;
      recepientPID: string;
    };
    receiptData: {
      receiptName: string;
      date: string;
      VAT: boolean;
      note: string;
      contact: string;
      contact_name: string;
      email: string;
      totalCurrency: string;
      services: {
        name: string;
        price: number;
        ammount: number;
        total: string;
      }[];
    };
  }>({
    apartmentData: {
      name: "",
      address: "",
      owner: "",
      image: "",
      pid: "",
      iban: "",
    },
    recepientData: {
      recepientName: "",
      recepientAddress: "",
      recepientPID: "",
    },
    receiptData: {
      receiptName: "",
      date: "",
      VAT: false,
      note: "",
      contact: "",
      contact_name: "",
      email: "",
      totalCurrency: "",
      services: [
        {
          name: "",
          price: 0,
          ammount: 0,
          total: "",
        },
      ],
    },
  });

  const [instance, updateInstance] = usePDF({
    document: ReceiptTemplate({
      apartmentData: selectedApartment
        ? {
            name: selectedApartment.name,
            address: selectedApartment.address,
            image: selectedApartment.image,
            owner: selectedApartment.owner ? selectedApartment.owner : "",
            pid: selectedApartment.pid ? selectedApartment.pid : "",
            iban: selectedApartment.iban ? selectedApartment.iban : "",
          }
        : {
            name: "",
            address: "",
            owner: "",
            image: "",
            pid: "",
            iban: "",
          },
      receiptData: transactionReceiptData.receiptData,
      recepientData: transactionReceiptData.recepientData,
    }),
  });

  const updateInstanceRef: { current: null | ReturnType<typeof setTimeout> } =
    useRef(null);

  useEffect(() => {
    if (updateInstanceRef.current) {
      clearTimeout(updateInstanceRef.current);
    }
    updateInstanceRef.current = setTimeout(() => {
      updateInstance();
    }, 500);
  }, [i18n.language, transactionReceiptData]);

  useEffect(() => {
    if (selectedApartment) {
      setTransactionReceiptData({
        ...transactionReceiptData,
        apartmentData: {
          name: selectedApartment.name,
          address: selectedApartment.address,
          image: selectedApartment.image,
          owner: selectedApartment.owner ? selectedApartment.owner : "",
          pid: selectedApartment.pid ? selectedApartment.pid : "",
          iban: selectedApartment.iban ? selectedApartment.iban : "",
        },
      });
    }
  }, [selectedApartment]);

  const onDocumentLoadSuccess = useCallback(
    (document: any) => {
      const { numPages: nextNumPages } = document;
      if (pageNumber > nextNumPages) {
        setPageNumber(nextNumPages);
      }
      setNumPages(nextNumPages);
    },
    [instance.blob]
  );

  const onItemClick = useCallback(
    ({ pageNumber: nextPageNumber }: { pageNumber: number }) => {
      setPageNumber(nextPageNumber);
    },
    []
  );

  const renderReceipt = () => {
    return (
      <div>
        <div className="w-56">
          <Dropdown
            placeholder="Select apartment"
            data={Object.keys(apartments?.apartments).map(key => {
              return {
                id: apartments.apartments[key].id,
                name: apartments.apartments[key].name,
                value: apartments.apartments[key],
              };
            })}
            selected={selectedApartment?.id as string}
            setData={item => {
              if (item !== (selectedApartment?.id as string)) {
                dispatch(selectApartment(apartments.apartments[item]));
              }
            }}
          />
        </div>
        {selectedApartment && (
          <div className="flex justify-around mt-5 flex-col xl:flex-row gap-5">
            <div
              className={`flex gap-3 flex-col w-full xl:w-1/2`}
              style={{
                minHeight:
                  window.innerHeight - 60 - window.innerHeight * 0.05 + "px",
              }}
            >
              {Object.keys(transactionReceiptData).map(key => {
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
                        transactionReceiptData[
                          key as keyof typeof transactionReceiptData
                        ]
                      ).map(([innerKey, value]) => {
                        if (innerKey !== "image") {
                          if (innerKey !== "services") {
                            return (
                              <div key={innerKey} className="flex flex-col">
                                <span className="font-bold">{t(innerKey)}</span>
                                {innerKey === "VAT" ? (
                                  <input
                                    className="h-6 focus:border-blue-500"
                                    type={"checkbox"}
                                    checked={value ? Boolean(value) : false}
                                    onChange={e => {
                                      setTransactionReceiptData({
                                        ...transactionReceiptData,
                                        receiptData: {
                                          ...transactionReceiptData[
                                            "receiptData"
                                          ],
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
                                      setTransactionReceiptData({
                                        ...transactionReceiptData,
                                        [key]: {
                                          ...transactionReceiptData[
                                            key as keyof typeof transactionReceiptData
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
                                    transactionReceiptData["receiptData"][
                                      "services"
                                    ]
                                  ).map(([serviceKey, serviceValue]) => {
                                    let newArray = [
                                      ...transactionReceiptData["receiptData"][
                                        "services"
                                      ],
                                    ];
                                    return (
                                      <div
                                        key={`service-${serviceKey}`}
                                        className="flex flex-row gap-2 w-full mb-2"
                                      >
                                        <input
                                          className="appearance-none border rounded-md text-gray-700 leading-tight focus:border-blue-500 w-2/6"
                                          type={"text"}
                                          value={serviceValue.name}
                                          onChange={e => {
                                            newArray[Number(serviceKey)].name =
                                              e.target.value;
                                            newArray[Number(serviceKey)].total =
                                              (
                                                serviceValue.price *
                                                serviceValue.ammount
                                              ).toFixed(2);
                                            setTransactionReceiptData({
                                              ...transactionReceiptData,
                                              [key]: {
                                                ...transactionReceiptData[
                                                  key as keyof typeof transactionReceiptData
                                                ],
                                                services: newArray,
                                              },
                                            });
                                          }}
                                        />
                                        <input
                                          className="appearance-none border rounded-md text-gray-700 leading-tight focus:border-blue-500 w-1/6"
                                          type={"number"}
                                          value={serviceValue.ammount}
                                          onChange={e => {
                                            newArray[
                                              Number(serviceKey)
                                            ].ammount = Number(e.target.value);
                                            newArray[Number(serviceKey)].total =
                                              (
                                                serviceValue.price *
                                                serviceValue.ammount
                                              ).toFixed(2);
                                            setTransactionReceiptData({
                                              ...transactionReceiptData,
                                              [key]: {
                                                ...transactionReceiptData[
                                                  key as keyof typeof transactionReceiptData
                                                ],
                                                services: newArray,
                                              },
                                            });
                                          }}
                                        />
                                        <input
                                          className="appearance-none border rounded-md text-gray-700 leading-tight focus:border-blue-500 w-1/6"
                                          type={"number"}
                                          value={serviceValue.price}
                                          onChange={e => {
                                            newArray[Number(serviceKey)].price =
                                              Number(e.target.value);
                                            newArray[Number(serviceKey)].total =
                                              (
                                                serviceValue.price *
                                                serviceValue.ammount
                                              ).toFixed(2);
                                            setTransactionReceiptData({
                                              ...transactionReceiptData,
                                              [key]: {
                                                ...transactionReceiptData[
                                                  key as keyof typeof transactionReceiptData
                                                ],
                                                services: newArray,
                                              },
                                            });
                                          }}
                                        />
                                        <div className="appearance-none bg-gray-200 flex items-center justify-center border rounded-md text-gray-700 leading-tight focus:border-blue-500 w-1/6">
                                          {serviceValue.total}
                                        </div>
                                        <button
                                          className={`${style.removeButton}
                                            w-10 h-10`}
                                          onClick={() => {
                                            newArray.splice(
                                              Number(serviceKey),
                                              1
                                            );
                                            setTransactionReceiptData({
                                              ...transactionReceiptData,
                                              [key]: {
                                                ...transactionReceiptData[
                                                  key as keyof typeof transactionReceiptData
                                                ],
                                                services: newArray,
                                              },
                                            });
                                          }}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                                <button
                                  className="appearance-none p-3 border rounded-md bg-white hover:bg-gray-100 text-gray-700 leading-tight"
                                  onClick={() => {
                                    setTransactionReceiptData({
                                      ...transactionReceiptData,
                                      [key]: {
                                        ...transactionReceiptData[
                                          key as keyof typeof transactionReceiptData
                                        ],
                                        services: [
                                          ...transactionReceiptData[
                                            "receiptData"
                                          ]["services"],
                                          {
                                            name: "",
                                            ammount: 0,
                                            price: 0,
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
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`w-full xl:w-1/2`}>
              <Suspense fallback={<PageLoader />}>
                <Document
                  {...options}
                  file={instance.url}
                  renderMode="svg"
                  className="drop-shadow-2xl flex justify-center items-center sticky top-0 w-full"
                  onItemClick={onItemClick}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page renderMode="canvas" pageNumber={pageNumber || 1}>
                    {pageNumber && numPages && (
                      <div className={`${style["document-controls"]}`}>
                        <div className={`${style["page-controls-navigation"]}`}>
                          <button
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber(pageNumber - 1)}
                            type="button"
                            aria-label="Previous page"
                          >
                            ‹
                          </button>
                          <span>
                            {pageNumber} of {numPages}
                          </span>
                          <button
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber(pageNumber + 1)}
                            type="button"
                            aria-label="Next page"
                          >
                            ›
                          </button>
                        </div>
                        <button
                          className={`${style["pdf-download"]}`}
                          onClick={() => setDisplayDownloadModal(true)}
                        />
                      </div>
                    )}
                  </Page>
                </Document>
              </Suspense>
            </div>
          </div>
        )}
        {instance && instance.blob && instance.url && (
          <PDFDownload
            pdfInstance={{ url: instance.url, blob: instance.blob }}
            show={displayDownloadModal}
            closeModal={() => setDisplayDownloadModal(false)}
          />
        )}
      </div>
    );
  };

  return renderReceipt();
};

export default Receipt;
