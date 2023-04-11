import { getApartmentsForUser } from '@/store/firebaseActions/apartmentActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectApartment } from '@/store/reducers/apartments';
import { Dropdown } from '@modules/Shared/Dropdown';
import { InvoiceDisplay, InvoiceInputs } from '@modules/Invoice';
import { FC, useEffect, useState } from 'react';

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

export const Invoice: FC = () => {
  const dispatch = useAppDispatch();
  const { apartments } = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );

  const [transactionInvoiceData, setTransactionInvoiceData] =
    useState<TransactionInvoiceData>({
      apartmentData: {
        name: '',
        address: '',
        owner: '',
        image: '',
        pid: '',
        iban: '',
      },
      recepientData: {
        recepientName: '',
        recepientAddress: '',
        recepientPID: '',
      },
      invoiceData: {
        invoiceName: '',
        date: '',
        dateOfFiscalization: '',
        VAT: false,
        note: '',
        contact: '',
        contact_name: '',
        email: '',
        totalCurrency: '',
        services: [
          {
            name: '',
            price: '',
            amount: '',
            total: '',
          },
        ],
      },
    });

  useEffect(() => {
    if (!apartments) {
      dispatch(getApartmentsForUser());
    }
  }, []);

  const renderInvoice = () => {
    return (
      <div>
        <div className='w-56'>
          <Dropdown
            placeholder='Select apartment'
            data={
              apartments &&
              Object.keys(apartments).map(key => {
                return {
                  id: apartments[key].id,
                  name: apartments[key].name,
                  value: apartments[key],
                };
              })
            }
            selected={selectedApartment?.id as string}
            setData={item => {
              if (item.id !== (selectedApartment?.id as string)) {
                dispatch(selectApartment(apartments[item.id]));
              }
            }}
          />
        </div>
        {selectedApartment && (
          <div className='mt-5 flex flex-col justify-around gap-5 2xl:flex-row'>
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
