import { usePDF } from "@react-pdf/renderer";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import { useAppSelector } from "../../../../../store/hooks";
import PageLoader from "../../Loader/PageLoader";
import PDFDownload from "../../PDFDownload/PDFDownload";
import { TransactionInvoiceData } from "../Invoice";
import InvoiceTemplate from "../Templates/InvoiceTemplate";
import style from "./InvoiceDisplay.module.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Props = {
  invoiceData: TransactionInvoiceData;
  setInvoiceData: (data: TransactionInvoiceData) => void;
};

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

const InvoiceDisplay = (props: Props) => {
  const { invoiceData, setInvoiceData } = props;

  const { i18n } = useTranslation();

  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );

  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [displayDownloadModal, setDisplayDownloadModal] = useState(false);

  const [instance, updateInstance] = usePDF({
    document: InvoiceTemplate({
      apartmentData: invoiceData.apartmentData,
      invoiceData: invoiceData.invoiceData,
      recepientData: invoiceData.recepientData,
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
  }, [i18n.language, invoiceData]);

  useEffect(() => {
    if (selectedApartment) {
      setInvoiceData({
        ...invoiceData,
        apartmentData: {
          name: selectedApartment.name,
          address: selectedApartment.address,
          image: selectedApartment.image,
          owner: selectedApartment.owner ?? "",
          pid: selectedApartment.pid ?? "",
          iban: selectedApartment.iban ?? "",
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

  return (
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

export default InvoiceDisplay;
