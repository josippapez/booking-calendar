import { getApartmentsForUser } from '@/store/firebaseActions/apartmentActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectApartment } from '@/store/reducers/apartments';
import { Apartment } from '@modules/Apartments/models/Apartment';
import { InvoiceDisplay } from '@modules/Invoice/InvoiceDisplay/InvoiceDisplay';
import { InvoiceInputs } from '@modules/Invoice/InvoiceInputs/InvoiceInputs';
import { Dropdown } from '@modules/Shared/Dropdown/Dropdown';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type TransactionInvoiceData = {
  apartmentData: Apartment;
  recipientData: {
    recipientName: string;
    recipientAddress: string;
    recipientPID: string;
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
  const { t } = useTranslation('InvoiceInputs');
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
        id: '',
        email: '',
        pricePerNight: undefined,
      },
      recipientData: {
        recipientName: '',
        recipientAddress: '',
        recipientPID: '',
      },
      invoiceData: {
        invoiceName: t('invoiceNamePlaceholder', {
          year: new Date().getFullYear(),
        }).toString(),
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
          <div className='mt-5 flex h-full flex-col justify-around gap-5 2xl:flex-row'>
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
