import { NextPage } from "next";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  Apartment,
  selectApartment,
} from "../../../../store/reducers/apartments";
import Dropdown from "../Dropdown/Dropdown";
import InvoiceDisplay from "./InvoiceDisplay/InvoiceDisplay";
import InvoiceInputs from "./InvoiceInputs/InvoiceInputs";

type Props = {};

export type TransactionInvoiceData = {
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
  invoiceData: {
    invoiceName: string;
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

const Invoice: NextPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const apartments = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );

  const [transactionInvoiceData, setTransactionInvoiceData] =
    useState<TransactionInvoiceData>({
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
      invoiceData: {
        invoiceName: "",
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

  const renderInvoice = () => {
    return (
      <div>
        <div className="w-56">
          <Dropdown
            placeholder="Select apartment"
            data={apartments?.apartments.map(apartment => {
              return {
                id: apartment.id,
                name: apartment.name,
                value: apartment,
              };
            })}
            selected={selectedApartment?.id as string}
            setData={item => {
              if (item.id !== (selectedApartment?.id as string)) {
                dispatch(selectApartment(item.value as Apartment));
              }
            }}
          />
        </div>
        {selectedApartment && (
          <div className="flex justify-around mt-5 flex-col xl:flex-row gap-5">
            <InvoiceInputs
              invoiceData={transactionInvoiceData}
              setInvoiceData={setTransactionInvoiceData}
            />
            <InvoiceDisplay
              invoiceData={transactionInvoiceData}
              setInvoiceData={setTransactionInvoiceData}
            />
          </div>
        )}
      </div>
    );
  };

  return renderInvoice();
};

export default Invoice;