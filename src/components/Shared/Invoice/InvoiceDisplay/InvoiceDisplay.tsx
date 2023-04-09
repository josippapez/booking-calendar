import { useWindowSize } from '@/Hooks';
import TransactionInvoice from '@/components/Shared/Invoice/Templates/TransactionInvoice';
import { usePDFComponentsAreHTML } from '@/components/Shared/Invoice/Templates/custom/Components';
import { PDFDownload } from '@/components/Shared/PDFDownload/PDFDownload';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useAppSelector } from '../../../../../store/hooks';
import { TransactionInvoiceData } from '../Invoice';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Props = {
  invoiceData: TransactionInvoiceData;
  setInvoiceData: (data: TransactionInvoiceData) => void;
};

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
};

const InvoiceDisplay = (props: Props) => {
  const { invoiceData, setInvoiceData } = props;
  const windowSize = useWindowSize();
  const { i18n, t } = useTranslation('TransactionInvoice');
  const { isHTML } = usePDFComponentsAreHTML();

  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );

  const [displayDownloadModal, setDisplayDownloadModal] = useState(false);

  const TemplateNotHtml = useCallback(
    () =>
      TransactionInvoice({
        ...invoiceData,
        translate: t,
        locale: i18n.language,
      }),
    [isHTML, invoiceData]
  );
  const Template = () =>
    TransactionInvoice({ ...invoiceData, translate: t, locale: i18n.language });

  useEffect(() => {
    if (selectedApartment) {
      setInvoiceData({
        ...invoiceData,
        apartmentData: {
          name: selectedApartment.name,
          address: selectedApartment.address,
          image: selectedApartment.image,
          owner: selectedApartment.owner ?? '',
          pid: selectedApartment.pid ?? '',
          iban: selectedApartment.iban ?? '',
        },
      });
    }
  }, [selectedApartment]);

  const scale =
    windowSize.width < windowSize.height
      ? (windowSize.width - 170) / 595
      : (windowSize.height - 170) / 842;

  return (
    <>
      <div
        className={`documentPDFView relative flex flex-col items-center justify-center drop-shadow-xl 2xl:w-4/5`}
        style={{
          height: 842 * scale,
        }}
      >
        <div
          className='document-display'
          style={{
            width: 595,
            height: 842,
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

export default InvoiceDisplay;
