import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TransactionReceiptData } from "../Receipt";
import TransactionReceipt from "./TransactionReceipt";

type Props = {
  apartmentData: TransactionReceiptData["apartmentData"];
  recepientData: TransactionReceiptData["recepientData"];
  receiptData: TransactionReceiptData["receiptData"];
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
