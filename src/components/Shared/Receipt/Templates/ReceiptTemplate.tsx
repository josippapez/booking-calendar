import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TransactionReceipt from "./TransactionReceipt";

type Props = {
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
    dateOfFiscalization: string;
    VAT: boolean;
    note: string;
    contact: string;
    contact_name: string;
    email: string;
    totalCurrency: string;
    services: {
      name: string;
      price: string;
      ammount: string;
      total: string;
    }[];
  };
};

const ReceiptTemplate = (props: Props): JSX.Element => {
  const { apartmentData, receiptData, recepientData } = props;
  const { t, i18n } = useTranslation("TransactionReceipt");
  const options = {
    translate: t,
    locale: i18n.language,
    apartmentData,
    receiptData,
    recepientData,
  };

  return useMemo(
    () => TransactionReceipt(options),
    [i18n.language, apartmentData, receiptData, recepientData]
  );
};

export default ReceiptTemplate;
