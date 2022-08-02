import { useMemo } from "react";
import { TFunction } from "react-i18next";
import { Apartment } from "../../../../../store/reducers/apartments";
import TransactionReceipt from "./TransactionReceipt";

type Props = {
  t: TFunction;
  locale: string;
  apartmentData: Apartment | null;
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
      price: string;
      ammount: string;
      total: string;
    }[];
  };
};

const ReceiptTemplate = (props: Props): JSX.Element => {
  const { t, locale, apartmentData, receiptData, recepientData } = props;

  const options = {
    translate: t,
    locale: locale,
    apartmentData: apartmentData,
    receiptData: receiptData,
    recepientData: recepientData,
  };

  return useMemo(
    () => TransactionReceipt(options),
    [apartmentData, receiptData, recepientData]
  );
};

export default ReceiptTemplate;
