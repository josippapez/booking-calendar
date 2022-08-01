import { useMemo } from "react";
import { TFunction } from "react-i18next";
import { Apartment } from "../../../../../store/reducers/apartments";
import TransactionReceipt from "./TransactionReceipt";

type Props = {
  t: TFunction;
  apartmentData: Apartment | null;
  receiptData: {
    receiptName: string;
    apartmentOwner: string;
    recepient: string;
    recepientAddress: string;
    recepientPID: string;
    apartmentPID: string;
    apartmentIBAN: string;
  };
};

const ReceiptTemplate = (props: Props): JSX.Element => {
  const { t, apartmentData, receiptData } = props;

  const options = {
    translate: t,
    apartmentData: apartmentData,
    receiptData: receiptData,
  };

  return useMemo(
    () => TransactionReceipt(options),
    [apartmentData, receiptData]
  );
};

export default ReceiptTemplate;
