import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TransactionInvoiceData } from "../Invoice";
import TransactionInvoice from "./TransactionInvoice";

type Props = {
  apartmentData: TransactionInvoiceData["apartmentData"];
  recepientData: TransactionInvoiceData["recepientData"];
  invoiceData: TransactionInvoiceData["invoiceData"];
};

const InvoiceTemplate = (props: Props): JSX.Element => {
  const { apartmentData, invoiceData, recepientData } = props;
  const { t, i18n } = useTranslation("TransactionInvoice");
  const options = useMemo(() => {
    return {
      translate: t,
      locale: i18n.language,
      apartmentData,
      invoiceData,
      recepientData,
    };
  }, [i18n.language, apartmentData, invoiceData, recepientData, t]);

  return useMemo(() => {
    return TransactionInvoice(options);
  }, [options]);
};

export default InvoiceTemplate;
