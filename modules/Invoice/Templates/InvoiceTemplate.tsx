'use client';

import { TransactionInvoice } from '@modules/Invoice/Templates/TransactionInvoice';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { TransactionInvoiceData } from '../Invoice';

type Props = {
  apartmentData: TransactionInvoiceData['apartmentData'];
  recipientData: TransactionInvoiceData['recipientData'];
  invoiceData: TransactionInvoiceData['invoiceData'];
};

export const InvoiceTemplate = (props: Props): JSX.Element => {
  const { apartmentData, invoiceData, recipientData } = props;
  const locale = useLocale();
  const t = useTranslations('TransactionInvoice');
  const options = useMemo(() => {
    return {
      translate: t,
      locale,
      apartmentData,
      invoiceData,
      recipientData,
    };
  }, [locale, apartmentData, invoiceData, recipientData, t]);

  return useMemo(() => {
    return <TransactionInvoice {...options} />;
  }, [options]);
};
