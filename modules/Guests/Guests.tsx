'use client';

import {
  GuestObject,
  SingleApartmentDto,
  useApartmentsControllerFindAllSuspense,
  useGuestsControllerFindAll,
} from '@/api';
import { AddNewGuest } from '@modules/Guests/GuestsModal/AddNewGuest';
import { EditGuest } from '@modules/Guests/GuestsModal/EditGuestModal';
import { DatePickerHeader } from '@modules/Shared/DatePicker/Header/DatePickerHeader';
import { Dropdown } from '@modules/Shared/Dropdown/Dropdown';
import { useCalculateEachDayOfMonth } from '@modules/Shared/Hooks/calculateEachDayOfMonth';
import Images from '@public/Styles/Assets/Images/Images';
import { DateTime, Info } from 'luxon';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

export const Guests: FC = () => {
  const t = useTranslations('Guests');

  const [selectedMonth, setSelectedMonth] = useState<null | number>(null);
  const [showAddNewGuestModal, setShowAddNewGuestModal] = useState(false);
  const [showEditGuestModal, setShowEditGuestModal] = useState(false);
  const [sorting, setSorting] = useState<string>('desc');
  const [selectedGuest, setSelectedGuest] = useState<GuestObject>();
  const [selectedApartment, setSelectedApartment] =
    useState<SingleApartmentDto>();

  const { year, setyear } = useCalculateEachDayOfMonth({
    startYear: DateTime.local().year,
    startMonth: DateTime.local().month,
  });

  const { data: apartments, refetch: refetchApartments } =
    useApartmentsControllerFindAllSuspense({
      query: {
        queryKey: ['apartments'],
      },
    });

  const { data: guests, refetch: refetchGuests } = useGuestsControllerFindAll(
    {
      apartmentId: selectedApartment?.id ?? '',
      selectedYear: year.toString(),
    },
    {
      query: {
        enabled: !!selectedApartment,
        queryKey: ['guests', selectedApartment?.id, year.toString()],
      },
    }
  );

  useEffect(() => {
    if (!selectedApartment && apartments && apartments.length > 0) {
      setSelectedApartment(apartments[0]);
    }
  }, [apartments, selectedApartment]);

  const guestDataByYear = guests?.data?.[year];

  return (
    <>
      <h1 className='text-3xl font-bold'>{t('guest_book')}</h1>
      <>
        <div className='mb-10 mt-7 flex items-center justify-between'>
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
          {selectedApartment && (
            <button
              onClick={() => setShowAddNewGuestModal(true)}
              className='hover: rounded-md bg-blue-700 p-2 font-bold text-white hover:bg-blue-500'
            >
              {t('add_new_guest')}
            </button>
          )}
        </div>
        <div className='mb-5 flex gap-4'>
          <button
            className='flex items-center justify-center gap-3 rounded-md px-3 text-xl font-semibold drop-shadow-md hover:bg-stone-200'
            onClick={() => {
              if (sorting === 'desc') {
                return setSorting('asc');
              }
              setSorting('desc');
            }}
          >
            {t('sorting')}
            <Image
              src={Images.DownArrow}
              alt='arrow'
              height={25}
              width={25}
              className={`${sorting === 'asc' ? 'rotate-180' : ''}`}
            />
          </button>
          <DatePickerHeader
            hideMonth
            hideOnlyYearButton
            selectedYear={year}
            setSelectedYear={setyear}
          />
        </div>
        {selectedApartment && (
          <>
            {guestDataByYear &&
              Object.keys(guestDataByYear)
                .sort((a, b) =>
                  Number(a) > Number(b)
                    ? sorting === 'asc'
                      ? -1
                      : 1
                    : sorting === 'asc'
                      ? 1
                      : -1
                )
                .map(month => {
                  return (
                    <div key={month}>
                      <h1
                        className={`mb-3 cursor-pointer text-3xl font-extrabold drop-shadow-md hover:bg-neutral-300 ${
                          selectedMonth === parseInt(month) && 'bg-neutral-200'
                        } rounded-md px-4 py-3`}
                        onClick={() => {
                          if (selectedMonth === parseInt(month)) {
                            setSelectedMonth(null);
                          } else {
                            setSelectedMonth(parseInt(month));
                          }
                        }}
                      >
                        {Info.months('long')[Number(month) - 1]}
                      </h1>
                      {selectedMonth === parseInt(month) && (
                        <div
                          className={`relative overflow-x-auto drop-shadow-md`}
                        >
                          <table className='w-full border-separate border-spacing-x-4 whitespace-nowrap'>
                            <thead className='text-left text-lg'>
                              <tr className='h-16'>
                                <th className='font-semibold'>{t('name')}</th>
                                <th className='font-semibold'>{t('PID')}</th>
                                <th className='font-semibold'>
                                  {t('dateOfBirth')}
                                </th>
                                <th className='font-semibold'>
                                  {t('country')}
                                </th>
                                <th className='font-semibold'>
                                  {t('address')}
                                </th>
                                <th className='font-semibold'>
                                  {t('dateOfArrival')}
                                </th>
                                <th className='font-semibold'>
                                  {t('dateOfDeparture')}
                                </th>
                                <th className='font-semibold'>
                                  {t('numberOfInvoice')}
                                </th>
                                <th className='font-semibold'>{t('note')}</th>
                              </tr>
                            </thead>
                            <tbody className='text-lg'>
                              {guestDataByYear[month]
                                ?.sort(
                                  (
                                    { dateOfArrival: firstValue },
                                    { dateOfArrival: secondValue }
                                  ) => (secondValue > firstValue ? 1 : -1)
                                )
                                .map(guest => {
                                  return (
                                    <tr
                                      key={guest.id}
                                      className='h-16 hover:cursor-pointer'
                                      onClick={() => {
                                        setSelectedGuest(guest);
                                        setShowEditGuestModal(true);
                                      }}
                                    >
                                      <td className='font-medium'>
                                        {guest.name}
                                      </td>
                                      <td>{guest.PID}</td>
                                      <td>
                                        {guest.dateOfBirth &&
                                          DateTime.fromISO(
                                            guest.dateOfBirth
                                          ).toLocaleString({
                                            month: 'long',
                                            day: '2-digit',
                                            year: 'numeric',
                                          })}
                                      </td>
                                      <td>{guest.country}</td>
                                      <td>{guest.address}</td>
                                      <td>
                                        {DateTime.fromISO(
                                          guest.dateOfArrival
                                        ).toLocaleString({
                                          month: 'long',
                                          day: '2-digit',
                                          year: 'numeric',
                                        })}
                                      </td>
                                      <td>
                                        {DateTime.fromISO(
                                          guest.dateOfDeparture
                                        ).toLocaleString({
                                          month: 'long',
                                          day: '2-digit',
                                          year: 'numeric',
                                        })}
                                      </td>
                                      <td>{guest.numberOfInvoice}</td>
                                      <td>{guest.note}</td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
            {showAddNewGuestModal && (
              <AddNewGuest
                show={true}
                apartment={selectedApartment}
                closeModal={() => {
                  setShowAddNewGuestModal(false);
                  setSelectedGuest(undefined);
                }}
              />
            )}
            {showEditGuestModal && selectedGuest && (
              <EditGuest
                selectedGuest={selectedGuest}
                show={true}
                apartment={selectedApartment}
                closeModal={() => {
                  setShowEditGuestModal(false);
                  setSelectedGuest(undefined);
                }}
              />
            )}
          </>
        )}
      </>
    </>
  );
};
