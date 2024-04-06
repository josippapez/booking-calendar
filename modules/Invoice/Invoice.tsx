'use client';

import { SingleApartmentDto, useApartmentsControllerFindAll } from '@/api';
import { InvoiceDisplay } from '@modules/Invoice/InvoiceDisplay/InvoiceDisplay';
import { InvoiceInputs } from '@modules/Invoice/InvoiceInputs/InvoiceInputs';
import { Dropdown } from '@modules/Shared/Dropdown/Dropdown';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';

export type TransactionInvoiceData = {
  apartmentData: Omit<SingleApartmentDto, 'id' | 'pricePerNight'>;
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
  const t = useTranslations('InvoiceInputs');

  const { data: apartments, refetch: refetchApartments } =
    useApartmentsControllerFindAll({
      query: {
        queryKey: ['apartments'],
      },
    });

  const [selectedApartment, setSelectedApartment] = useState<
    undefined | SingleApartmentDto
  >();

  const [transactionInvoiceData, setTransactionInvoiceData] =
    useState<TransactionInvoiceData>({
      apartmentData: {
        name: '',
        address: '',
        owner: '',
        image: '',
        pid: '',
        iban: '',
        email: '',
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
    if (!selectedApartment && apartments && apartments.length > 0) {
      setSelectedApartment(apartments[0]);
    }
  }, [apartments, selectedApartment]);

  useEffect(() => {
    if (selectedApartment) {
      setTransactionInvoiceData({
        ...transactionInvoiceData,
        apartmentData: {
          address: selectedApartment.address,
          email: selectedApartment.email,
          iban: selectedApartment.iban,
          name: selectedApartment.name,
          owner: selectedApartment.owner,
          pid: selectedApartment.pid,
          image: selectedApartment.image,
        },
      });
    }
  }, [selectedApartment]);

  const renderInvoice = () => {
    return (
      <div>
        <div className='w-56'>
          <Dropdown
            placeholder='Select apartment'
            data={apartments?.map(apartment => {
              return {
                id: apartment.id,
                value: apartment.name,
                data: apartment,
              };
            })}
            selectedValue={selectedApartment?.id as string}
            onSelectionChange={item => {
              if (!item) return setSelectedApartment(undefined);

              if (item.id !== (selectedApartment?.id as string)) {
                setSelectedApartment(item.data);
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
              selectedApartment={selectedApartment}
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
