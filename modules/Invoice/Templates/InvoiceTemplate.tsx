import { TransactionInvoice } from '@modules/Invoice/Templates/TransactionInvoice';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionInvoiceData } from '../Invoice';

type Props = {
  apartmentData: TransactionInvoiceData['apartmentData'];
  recipientData: TransactionInvoiceData['recipientData'];
  invoiceData: TransactionInvoiceData['invoiceData'];
};

export const InvoiceTemplate = (props: Props): JSX.Element => {
  const { apartmentData, invoiceData, recipientData } = props;
  const { t, i18n } = useTranslation('TransactionInvoice');
  const options = useMemo(() => {
    return {
      translate: t,
      locale: i18n.language,
      apartmentData,
      invoiceData,
      recipientData,
    };
  }, [i18n.language, apartmentData, invoiceData, recipientData, t]);

  return useMemo(() => {
    return TransactionInvoice(options);
  }, [options]);
};
