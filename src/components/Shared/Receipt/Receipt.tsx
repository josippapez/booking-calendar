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
  const { t, i18n } = useTranslation();
  const mobileView = useMobileView();

  const apartments = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );

  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayDownloadModal, setDisplayDownloadModal] =
    useState<boolean>(false);
  const [receiptData, setReceiptData] = useState({
    receiptName: "",
    apartmentOwner: "",
    apartmentIBAN: "",
    apartmentPID: "",
    recepient: "",
    recepientAddress: "",
    recepientPID: "",
  });

  const [instance, updateInstance] = usePDF({
    document: ReceiptTemplate({
      t,
      apartmentData: selectedApartment && { ...selectedApartment },
      receiptData,
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
  }, [i18n.language, receiptData, selectedApartment]);

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
            <div className="flex gap-3 flex-col w-full xl:w-1/2">
              <h1 className="text-2xl font-bold">Receipt</h1>
              <div className="flex flex-col">
                <span className="font-bold">Receipt name</span>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  type="text"
                  value={receiptData.receiptName}
                  onChange={e => {
                    setReceiptData({
                      ...receiptData,
                      receiptName: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Recepient</span>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  type="text"
                  value={receiptData.recepient}
                  onChange={e => {
                    setReceiptData({
                      ...receiptData,
                      recepient: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Recepient address</span>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  type="text"
                  value={receiptData.recepientAddress}
                  onChange={e => {
                    setReceiptData({
                      ...receiptData,
                      recepientAddress: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Recepient PID</span>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  type="text"
                  value={receiptData.recepientPID}
                  onChange={e => {
                    setReceiptData({
                      ...receiptData,
                      recepientPID: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Apartment owner</span>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  type="text"
                  value={receiptData.apartmentOwner}
                  onChange={e => {
                    setReceiptData({
                      ...receiptData,
                      apartmentOwner: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Apartment PID</span>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  type="text"
                  value={receiptData.apartmentPID}
                  onChange={e => {
                    setReceiptData({
                      ...receiptData,
                      apartmentPID: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">Recepient IBAN</span>
                <input
                  className="appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500"
                  type="text"
                  value={receiptData.apartmentIBAN}
                  onChange={e => {
                    setReceiptData({
                      ...receiptData,
                      apartmentIBAN: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="w-full xl:w-1/2">
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
