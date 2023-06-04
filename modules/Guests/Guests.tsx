import { FirebaseService } from '@/store/FirebaseService';
import { getApartmentsForUser } from '@/store/firebaseActions/apartmentActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectApartment } from '@/store/reducers/apartments';
import { setGuests } from '@/store/reducers/guests';
import { AddNewGuest, Guest } from '@modules/Guests/GuestsModal/AddNewGuest';
import { DatePickerHeader } from '@modules/Shared/DatePicker/Header/DatePickerHeader';
import { Dropdown } from '@modules/Shared/Dropdown/Dropdown';
import { useCalculateEachDayOfMonth } from '@modules/Shared/Hooks/calculateEachDayOfMonth';
import Images from '@public/Styles/Assets/Images/Images';
import { Routes } from 'consts';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import { DateTime, Info } from 'luxon';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const firebase = FirebaseService.getInstance();

export const Guests: FC = () => {
  const navigate = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation('Guests');
  const { apartments } = useAppSelector(state => state.apartments);
  const selectedApartment = useAppSelector(
    state => state.apartments.selectedApartment
  );
  const guests = useAppSelector(state => state.guests.guests);

  const [selectedMonth, setSelectedMonth] = useState<null | number>(null);
  const [showAddNewGuestModal, setShowAddNewGuestModal] = useState(false);
  const [sorting, setSorting] = useState<string>('desc');
  const [selectedGuest, setSelectedGuest] = useState<null | Guest>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');

  const { year, setyear } = useCalculateEachDayOfMonth({
    startYear: DateTime.local().year,
    startMonth: DateTime.local().month,
  });

  const getGuestsForApartment = async (id: string) => {
    try {
      const guestsForAppartment = await getDoc(
        doc(firebase.getFirestore(), `guests/${id}/data`, year.toString())
      ).then(doc => {
        if (doc.exists()) {
          return doc.data();
        } else {
          return {};
        }
      });

      dispatch(setGuests(guestsForAppartment));
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'permission-denied') {
          navigate.push(Routes.LOGIN);
        }
      }
    }
  };

  useEffect(() => {
    if (selectedApartment?.id) {
      getGuestsForApartment(selectedApartment.id);
    }
  }, [selectedApartment, year]);

  useEffect(() => {
    if (!apartments) {
      dispatch(getApartmentsForUser());
    }
  }, []);

  return (
    <>
      <h1 className='text-3xl font-bold'>{t('guest_book')}</h1>
      <>
        <div className='mb-10 mt-7 flex items-center justify-between'>
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
          {selectedApartment && (
            <button
              onClick={() => setShowAddNewGuestModal(true)}
              className='hover: rounded-md bg-blue-700 p-2 font-bold text-white hover:bg-blue-500'
            >
              {t('add_new_guest')}
            </button>
          )}
        </div>
        {selectedApartment && (
          <>
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
            {guests &&
              Object.keys(guests)
                .sort((a, b) =>
                  Number(a) > Number(b)
                    ? sorting === 'asc'
                      ? -1
                      : 1
                    : sorting === 'asc'
                    ? 1
                    : -1
                )
                .map(key => {
                  return (
                    <div key={key}>
                      <h1
                        className={`mb-3 cursor-pointer text-3xl font-extrabold drop-shadow-md hover:bg-neutral-300 ${
                          selectedMonth === parseInt(key) && 'bg-neutral-200'
                        } rounded-md px-4 py-3`}
                        onClick={() => {
                          if (selectedMonth === parseInt(key)) {
                            setSelectedMonth(null);
                          } else {
                            setSelectedMonth(parseInt(key));
                          }
                        }}
                      >
                        {Info.months('long')[Number(key) - 1]}
                      </h1>
                      {selectedMonth === parseInt(key) && (
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
                              {Object.entries(guests[key])
                                .sort(([, firstValue], [, secondValue]) =>
                                  secondValue.dateOfArrival >
                                  firstValue.dateOfArrival
                                    ? 1
                                    : -1
                                )
                                .map(([key, value]) => {
                                  return (
                                    <tr
                                      key={key}
                                      className='h-16 hover:cursor-pointer'
                                      onClick={() => {
                                        setSelectedGuestId(key);
                                        setSelectedGuest(value);
                                        setShowAddNewGuestModal(true);
                                      }}
                                    >
                                      <td className='font-medium'>
                                        {value.name}
                                      </td>
                                      <td>{value.PID}</td>
                                      <td>
                                        {DateTime.fromISO(
                                          value.dateOfBirth
                                        ).toLocaleString({
                                          month: 'long',
                                          day: '2-digit',
                                          year: 'numeric',
                                        })}
                                      </td>
                                      <td>{value.country}</td>
                                      <td>{value.address}</td>
                                      <td>
                                        {DateTime.fromISO(
                                          value.dateOfArrival
                                        ).toLocaleString({
                                          month: 'long',
                                          day: '2-digit',
                                          year: 'numeric',
                                        })}
                                      </td>
                                      <td>
                                        {DateTime.fromISO(
                                          value.dateOfDeparture
                                        ).toLocaleString({
                                          month: 'long',
                                          day: '2-digit',
                                          year: 'numeric',
                                        })}
                                      </td>
                                      <td>{value.numberOfInvoice}</td>
                                      <td>{value.note}</td>
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
          </>
        )}
      </>
      {showAddNewGuestModal && (
        <AddNewGuest
          selectedGuest={selectedGuest || undefined}
          selectedGuestId={selectedGuestId}
          show={showAddNewGuestModal}
          closeModal={() => {
            setShowAddNewGuestModal(false);
            setSelectedGuest(null);
          }}
        />
      )}
    </>
  );
};
