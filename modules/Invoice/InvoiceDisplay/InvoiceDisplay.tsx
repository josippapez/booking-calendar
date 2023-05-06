import { useAppSelector } from '@/store/hooks';
import {
  InvoiceTemplate,
  PDFDownload,
  TransactionInvoiceData,
  usePDFComponentsAreHTML,
} from '@modules/Invoice';
import { useWindowSize } from '@modules/Shared/Hooks';
import { useCallback, useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Props = {
  invoiceData: TransactionInvoiceData;
  setInvoiceData: (data: TransactionInvoiceData) => void;
};

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

export const InvoiceDisplay = (props: Props) => {
  const { invoiceData, setInvoiceData } = props;
  const windowSize = useWindowSize();
  const { isHTML } = usePDFComponentsAreHTML();

  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );

  const [displayDownloadModal, setDisplayDownloadModal] = useState(false);

  const TemplateNotHtml = useCallback(
    () => InvoiceTemplate(invoiceData),
    [isHTML, invoiceData]
  );
  const Template = () => InvoiceTemplate(invoiceData);

  useEffect(() => {
    if (selectedApartment) {
      setInvoiceData({
        ...invoiceData,
        apartmentData: {
          ...selectedApartment,
          pricePerNight: selectedApartment?.pricePerNight ?? 0,
        },
      });
    }
  }, [selectedApartment]);

  const scale =
    windowSize.width * 1.414213562 < windowSize.height
      ? (windowSize.width - 80) / 595
      : (windowSize.height - 80) / 842;

  return (
    <>
      <div
        className={`documentPDFView relative flex flex-col items-center justify-center drop-shadow-xl 2xl:w-4/5`}
        style={{
          // height: 842 * scale,
        }}
      >
        <div
          className='document-display'
          style={{
            width: 595,
            height: 842,
            aspectRatio: 1.414213562,
            transform: `scaleX(${scale}) scaleY(
                ${scale}
              )`,
          }}
        >
          <Template />
        </div>

        <div className='document-controls'>
          <button
            className='pdf-download'
            onClick={() => setDisplayDownloadModal(true)}
          />
        </div>
      </div>
      <PDFDownload
        PdfInstance={TemplateNotHtml}
        show={displayDownloadModal}
        closeModal={() => setDisplayDownloadModal(false)}
      />
    </>
  );
};
