import { NextPage } from "next";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectApartment } from "../../../../store/reducers/apartments";
import Dropdown from "../Dropdown/Dropdown";
import ReceiptDisplay from "./ReceiptDisplay/ReceiptDisplay";
import ReceiptInputs from "./ReceiptInputs/ReceiptInputs";

type Props = {};

export type TransactionReceiptData = {
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
    dateOfFiscalization: string;
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
      amount: string;
      total: string;
    }[];
  };
};

const Receipt: NextPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const apartments = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );

  const [transactionReceiptData, setTransactionReceiptData] =
    useState<TransactionReceiptData>({
      apartmentData: {
        name: "",
        address: "",
        owner: "",
        image: "",
        pid: "",
        iban: "",
      },
      recepientData: {
        recepientName: "",
        recepientAddress: "",
        recepientPID: "",
      },
      receiptData: {
        receiptName: "",
        date: "",
        dateOfFiscalization: "",
        VAT: false,
        note: "",
        contact: "",
        contact_name: "",
        email: "",
        totalCurrency: "",
        services: [
          {
            name: "",
            price: "",
            amount: "",
            total: "",
          },
        ],
      },
    });

  const renderReceipt = () => {
    return (
      <div>
        <div className="w-56">
          <Dropdown
            placeholder="Select apartment"
            data={Object.keys(apartments?.apartments).map(key => {
              return {
                id: apartments.apartments[key].id,
                name: apartments.apartments[key].name,
                value: apartments.apartments[key],
              };
            })}
            selected={selectedApartment?.id as string}
            setData={item => {
              if (item !== (selectedApartment?.id as string)) {
                dispatch(selectApartment(apartments.apartments[item]));
              }
            }}
          />
        </div>
        {selectedApartment && (
          <div className="flex justify-around mt-5 flex-col xl:flex-row gap-5">
            <ReceiptInputs
              receiptData={transactionReceiptData}
              setReceiptData={setTransactionReceiptData}
            />
            <ReceiptDisplay
              receiptData={transactionReceiptData}
              setReceiptData={setTransactionReceiptData}
            />
          </div>
        )}
      </div>
    );
  };

  return renderReceipt();
};

export default Receipt;
